<template>
  <div class="p-artist-detail">
    <div class="header">
      <div class="header-left">
        <img :src="albumImg" alt="">
      </div>
      <div class="header-right">
        <div class="right-desc">
          <div class="desc-title">
            {{albumName+albumAlias}}
          </div>
          <div class="desc-sub">
            <div>歌手：{{albumArtists.name}}</div>
            <div>发行时间：{{albumPublishTime}}</div>
          </div>
        </div>
        <div class="right-action">
          <div class="action-button" @click="handleToComment(albumId,'album')">
            <div class="button-icon">
              <i class="material-icons">message</i>
            </div>
            <div class="button-text">
              评论
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <scroll-view
          class="list-cnt"
          mp:scroll-y="true">
        <div class="list-item" v-for="item in songs.data" :key="item.id" @click="handlePlayMusic(item)">
          <div class="item-title">
            <div class="title-header">
              {{item.name}}
              <div class="title-sub-header" v-if="item.alia.length > 0">
                {{'（'+item.alia[0]+'）'}}
              </div>
            </div>
            <div class="title-desc">
              {{`${handleSplitArtists(item.ar)} - ${item.al.name}`}}
            </div>
          </div>
          <div class="item-action" @click.stop="handleSongSheetActive(item)">
            <i class="material-icons">more_vert</i>
          </div>
        </div>
        <i-divider color="#DF4337" lineColor="#DF4337">我是有底线的 :)</i-divider>
        <i-action-sheet
            :visible="songSheetVisible"
            :actions="currentSongAction"
            @clickhook="handleClickSongSheet"
            @cancel="handleSongSheetCancel">
          <div slot="header" style="padding: 10px">
            <div>歌曲：{{currentSongInfo.name}}</div>
          </div>
        </i-action-sheet>
      </scroll-view>
      <i-toast id="toast"></i-toast>
      <i-modal :visible="artistsModalVisible" title="请选择歌手" :show-ok="false" @cancel="handleCloseArtistsModal">
        <div class="artists-cnt" v-if="currentSongInfo.artists.length >= 2">
          <div class="artists-item" v-for="item in currentSongInfo.artists" :key="item.id" @click="handleToArtistDetail(item.id)">
            {{item.name}}
          </div>
        </div>
      </i-modal>
      <i-modal :visible="playlistModalVisible" title="请选择歌单" :show-ok="false" @cancel="handleClosePlaylistModal">
        <div class="artists-cnt">
          <div class="list-item"
               v-for="item in createdPlaylist"
               :key="item.id"
               @click="handleAddToPlaylist(item)"
          >
            <div class="left">
              <div class="left-img">
                <img :src="item.coverImgUrl" alt="">
              </div>
            </div>
            <div class="right">
              <div class="right-title">{{item.name}}</div>
              <div class="right-sub-title">{{item.trackCount+'首'}}</div>
            </div>
          </div>
        </div>
      </i-modal>
      <c-footerbar></c-footerbar>
    </div>
  </div>
</template>

<script>
import CFooterbar from '_c/footer-bar'
import {
  getAlbumAPI
 } from '_a/album'
import { splitArtists,formatTime } from '_u'
import {getUserPlaylistAPI} from "_a/user"
import { playMixin } from '_mixin'
import {getPlaylistTracksAPI} from "_a/playlist"
const { $Toast } = require('_v/base/index')
export default {
  name: "album-detail",
  // mixin~in~~in!
  mixins: [playMixin],
  components: {
    CFooterbar
  },
  data() {
    return {
      albumId: "",
      albumImg: "",
      albumName: "",
      albumAlias: "",
      albumPublishTime: 0,
      albumArtists: {},
      playlistModalVisible: false,
      createdPlaylist: [],
      artistsModalVisible: false,
      songSheetVisible: false,
      songs: {
        // 存放数据
        data: [],
      },
      // 当前歌曲抽屉数据
      currentSongInfo: {
        name: "",
        id: "",
        album: "",
        albumId: "",
        artists: [],
        duration: 0
      }
    }
  },
  methods: {
    /* methods
    -------------------------- */
    // 关闭模态框
    handleCloseArtistsModal() {
      this.artistsModalVisible = false
    },
    /* playlist common
    -------------------------- */
    handleClosePlaylistModal() {
      this.playlistModalVisible = false
    },
    async handleAddToPlaylist(el) {
      const res = await this.fetchPlaylistTracks({
        pid: el.id,
        tracks: this.currentSongInfo.id
      })
      if(res.data.code === 200) {
        $Toast({
          content: '添加成功',
          type: 'success'
        })
        const playlistRes = await this.fetchUserPlaylistSync()
        this.createdPlaylist = playlistRes.data.playlist.filter(val => val.subscribed === false)
      }else {
        $Toast({
          content: '添加失败',
          type: 'error'
        })
      }
      this.playlistModalVisible = false
    },
    initInfo(data) {
      this.albumImg = data.album.picUrl
      this.albumName = data.album.name
      if(data.album.alias.length) {
        this.albumAlias = `（${data.album.alias.join('/')}）`
      }
      this.albumArtists = data.album.artist
      this.albumPublishTime = formatTime(new Date(data.album.publishTime))
      this.songs.data = data.songs
    },
    handleClickSongSheet({detail}) {
      if(detail.index >= 0) {
        switch (detail.index) {
          case 0: {
            this.handleAddSong()
          }
            break;
          case 1: {
            this.playlistModalVisible = true
          }
            break;
          case 2: {
            this.handleToComment(this.currentSongInfo.id)
          }
            break;
          case 3: {
            if(this.currentSongInfo.artists.length >= 2) {
              this.artistsModalVisible = true
            }else
              this.handleToArtistDetail(this.currentSongInfo.artists[0].id)
            // this.handleToArtistDetail(this.currentSongInfo.artists[0].id)
          }
            break;
          case 4: {
            this.handleToAlbumDetail(this.currentSongInfo.albumId)
          }
            break;
        }
      }
    },
    // 播放音乐
    async handlePlayMusic(_) {
      const params = {
        id: _.id,
        name: _.name,
        album: {
          id: _.al.id,
          name: _.al.name
        },
        duration: _.dt,
        artists: _.ar
      }
      await this._handlePlayMusic(params)
    },
    // 添加到下一首歌曲
    async handleAddSong() {
      const _ = {
        id: this.currentSongInfo.id,
        name: this.currentSongInfo.name,
        album: {
          id: this.currentSongInfo.id,
          name: this.currentSongInfo.name
        },
        duration: this.currentSongInfo.duration,
        artists: this.currentSongInfo.artists,
      }
      await this._handleAddSong(_)
      this.songSheetVisible = false
    },
    handleSongSheetCancel() {
      this.songSheetVisible = false
    },
    handleSongSheetActive(_) {
      this.currentSongInfo.name = _.name
      this.currentSongInfo.id = _.id
      this.currentSongInfo.album = _.al.name
      this.currentSongInfo.albumId = _.al.id
      this.currentSongInfo.artists = _.ar
      this.currentSongInfo.duration = _.dt
      this.songSheetVisible = true
    },
    handleSplitArtists(data) {
      return splitArtists(data)
    },
    /* router
    -------------------------- */
    // 跳转到评论页
    handleToComment(id,type) {
      wx.navigateTo({
        url: '../comment/index?id=' + id + '&type='+ type
      })
    },
    /* fetch
    -------------------------- */
    async fetchAlbumSongs() {
      try {
        const params = {
          id: this.albumId
        }
        return await getAlbumAPI(params)
      } catch (e) {
        console.warn(e)
      }
    },
    async fetchUserPlaylistSync() {
      try {
        const uid = wx.getStorageSync('uid')
        const params ={
          uid: uid,
          timestamp: new Date().getTime()
        }
        return await getUserPlaylistAPI(params)
      } catch (e) {
        console.warn(e)
      }
    },
    async fetchPlaylistTracks(val) {
      try {
        const params = {
          op: 'add',
          pid: val.pid,
          tracks: val.tracks
        }
        return await getPlaylistTracksAPI(params)
      } catch (e) {
        console.warn(e)
      }
    }
  },
  computed: {
    currentSongAction() {
      return [
        {
          name: '下一首播放',
          icon: 'playon'
        },
        {
          name: '收藏到歌单',
          icon: 'collection'
        },
        {
          name: '评论',
          icon: 'interactive'
        },
        {
          name: '歌手：'+this.handleSplitArtists(this.currentSongInfo.artists),
          icon: 'integral',
        },
        {
          name: '专辑：'+this.currentSongInfo.album,
          icon: 'createtask'
        },
      ]
    },
  },
  async mounted() {
    this.albumId = this.$mp.options.albumId
    const res = await this.fetchAlbumSongs()
    const playlistRes = await this.fetchUserPlaylistSync()
    this.createdPlaylist = playlistRes.data.playlist.filter(val => val.subscribed === false)
    this.initInfo(res.data)
  }
}
</script>

<style lang="scss" scoped>
.p-artist-detail {
  width: 100%;
  height: 100%;
  padding-bottom: 50px;
  box-sizing: border-box;
  .header {
    width: 100%;
    height: 150px;
    background-color: rgba(0,0,0,.8);
    display: flex;
    &-left {
      width: 150px;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100px;
        height: 100px;
      }
    }
    &-right {
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;
      .right-desc {
        .desc-title {
          padding-bottom: 7px;
          font-size: 20px;
          color: #ffffff;
        }
        .desc-sub {
          font-size: 14px;
          color: rgba(255, 255, 255, .4);
        }
      }
      .right-action {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        padding-top: 10px;
        padding-right: 20px;
        .action-button {
          font-size: 14px;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: linear-gradient(to right,#ED6253,#CD4C43);
          border-radius: 50px;
          box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
          .button-icon {
            padding-right: 10px;
            i {
              font-size: 18px;
            }
          }
          .button-text {
            line-height: 1;
          }
        }
      }
    }
  }
  .center{
    .list-cnt {
      // 覆写默认样式
      // 隐藏滚动条
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
      width: 100%;
      height: calc(100vh - 150px);
      font-size: 14px;
      .list-item {
        width: 100%;
        height: 60px;
        position: relative;
        box-sizing: border-box;
        display: flex;
        padding-left: 10px;
        // MARK 真1rpx边框
        &::after {
          position: absolute;
          content: "";
          width: 100%;
          left: 0;
          bottom: 0;
          height: 1px;
          background-color: rgba(0, 0, 0, .1);
          transform: scale(1,0.5);
          transform-origin: center bottom;
        }
        .item-img {
          width: 40px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-right: 10px;
          img {
            width: 40px;
            height: 40px;
          }
        }
        .item-title {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          .title-header {
            font-size: 14px;
            display: flex;
            align-items: center;
            line-height: 1;
            .title-sub-header {
              /*padding-left: 5px;*/
              color: rgba(0,0,0,.3 );
              line-height: 1;
            }
          }
          .title-desc {
            color: rgba(0,0,0,.3);
            padding-top: 8px;
            font-size: 12px;
            display: flex;
            align-items: center;
            line-height: 1;
          }
        }
        .item-action {
          color: rgba(0,0,0, .2 );
          width: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .artists-cnt {
      .list-item {
        display: flex;
        padding: 10px 10px;
        text-align: left;
        .left {
          display: flex;
          align-items: center;
          &-img {
            display: flex;
            align-items: center;
            padding-right: 10px;
            img {
              width: 40px;
              height: 40px;
              border-radius: 4px;
            }
          }
        }
        .right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          &-title {
            font-size: 14px;
          }
          &-sub-title {
            font-size: 12px;
            color: rgba(0, 0, 0, .3);
          }
        }
      }
    }
    .artists-cnt {
      ::-webkit-scrollbar {
        width: 4px;
        height: 6px;
        color: transparent;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #DF4337;
      }
      .artists-item {
        padding-top: 10px;
        font-size: 18px;
        color: #000000;
      }
    }
  }
}
</style>