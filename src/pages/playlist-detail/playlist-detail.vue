<template>
  <div class="p-playlist-detail">
    <div class="header">
      <div class="header-left">
        <img :src="playlistInfo.coverImgUrl" alt="">
        <div class="header-left-count">
          <i class="material-icons">headset</i>
          <div>{{playlistInfo.playCount}}</div>
        </div>
      </div>
      <div class="header-right">
        <div class="right-desc">
          <div class="desc-title">
            {{playlistInfo.name}}
          </div>
          <div class="desc-sub">
            <div class="desc-sub-avatar">
              <img :src="creator.avatarUrl" alt="">
            </div>
            <div class="desc-sub-name">{{creator.name}}</div>
          </div>
        </div>
        <div class="right-action">
          <div class="action-button" @click="handleToComment(playlistInfo.id,'playlist')">
            <div class="button-icon">
              <i class="material-icons">message</i>
            </div>
            <div class="button-text">
              评论
            </div>
          </div>
          <div class="action-button" v-if="uid !== creator.id.toString()" @click="handleClickFollowArtist">
            <div class="button-icon" v-if="playlistInfo.subscribed">
              <i class="material-icons">favorite</i>
            </div>
            <div class="button-icon" v-if="!playlistInfo.subscribed">
              <i class="material-icons">favorite_border</i>
            </div>
            <div class="button-text" v-if="playlistInfo.subscribed">
              取消收藏
            </div>
            <div class="button-text" v-if="!playlistInfo.subscribed">
              收藏
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <scroll-view
        class="list-cnt"
        mp:scroll-y="true">
        <div class="list-item" v-for="item in songs" :key="item.id" @click="handlePlayMusic(item)">
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
          @click="handleClickSongSheet"
          @cancel="handleSongSheetCancel">
          <div slot="header" style="padding: 10px">
            <div>歌曲：{{currentSongInfo.name}}</div>
          </div>
        </i-action-sheet>
      </scroll-view>
      <i-modal :visible="artistsModalVisible" title="请选择歌手" :show-ok="false" @cancel="handleCloseArtistsModal">
        <div class="artists-cnt" v-if="currentSongInfo.artists.length >= 2">
          <div class="artists-item" v-for="item in currentSongInfo.artists" :key="item.id" @click="handleToArtistDetail(item.id)">
            {{item.name}}
          </div>
        </div>
      </i-modal>
      <i-toast id="toast"></i-toast>
      <c-footerbar></c-footerbar>
    </div>
  </div>
</template>

<script>
import CFooterbar from '_c/footer-bar'
import {
  getPlaylistDetailAPI
} from '_a/playlist'
import { getUserPlaylistAPI } from '_a/user'
import { playMixin } from '_mixin'
import {
  getSongDetailAPI
} from '_a/song'
import { splitArtists,formatTime,formatDuration } from '_u'
const { $Toast } = require('_v/base/index')
export default {
  name: "playlist-detail",
  components: {
    CFooterbar
  },
  data() {
    return {
      uid: '',
      creator: {
        id: '',
        name: '',
        avatarUrl: ''
      },
      playlistInfo: {
        id: '',
        name: '',
        coverImgUrl: '',
        // 播放总数
        playCount: 0,
        // 评论总数
        commentCount: 0,
        // 歌单歌曲总数
        trackCount: 0,
        // 是否收藏
        subscribed: false
      },
      ids: [],
      songs: [],
      songSheetVisible: false,
      artistsModalVisible: false,
      // 当前歌曲抽屉数据
      currentSongInfo: {
        name: "",
        id: "",
        author: "",
        albumName: "",
        albumId: "",
        artists: [],
        duration: null
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
          name: '歌手：' + this.handleSplitArtists(this.currentSongInfo.artists),
          icon: 'integral',
        },
        {
          name: '专辑：' + this.currentSongInfo.albumName,
          icon: 'createtask'
        },
      ]
    }
  },
  // mixin~in~~in!
  mixins: [playMixin],
  /* Mounted
  -------------------------- */
  async mounted() {
    this.playlistInfo.id = this.$mp.options.playlistId
    const res = await this.fetchPlaylistSongs()
    await this.initData(res)
    this.uid = wx.getStorageSync('uid')
  },
  methods: {
    /* Hook
    -------------------------- */
    // 获取点击索引
    handleClickSongSheet({_relatedInfo}) {
      if(_relatedInfo.anchorTargetText) {
        const index = this.currentSongAction.findIndex((val)=> {
          return val.name === _relatedInfo.anchorTargetText
        })
        switch (index) {
          case 0: {
            this.handleAddSong()
          }
            break;
          case 2: {
            this.handleToComment(this.currentSongInfo.id,'music')
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
    /* action
    -------------------------- */
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
    /* methods
    -------------------------- */
    async initData(val) {
      this.playlistInfo.name = val.data.playlist.name
      this.playlistInfo.coverImgUrl = val.data.playlist.coverImgUrl
      this.playlistInfo.playCount = val.data.playlist.playCount
      this.playlistInfo.commentCount = val.data.playlist.commentCount
      this.playlistInfo.trackCount = val.data.playlist.trackCount
      this.playlistInfo.subscribed = val.data.playlist.subscribed
      this.creator.id = val.data.playlist.creator.userId
      this.creator.name = val.data.playlist.creator.nickname
      this.creator.avatarUrl = val.data.playlist.creator.avatarUrl
      this.ids = val.data.playlist.trackIds.map(val => val.id)
      const res = await this.fetchSongDetail()
      this.songs = res.data.songs
    },
    // 打开歌曲动作抽屉
    handleSongSheetActive(_) {
      this.currentSongInfo.name = _.name
      this.currentSongInfo.id = _.id
      this.currentSongInfo.albumName = _.al.name
      this.currentSongInfo.albumId = _.al.id
      this.currentSongInfo.artists = _.ar
      this.currentSongInfo.duration = _.dt
      this.songSheetVisible = true
    },
    // 关闭歌曲的抽屉
    handleSongSheetCancel() {
      this.songSheetVisible = false
    },
    // 格式化歌手
    handleSplitArtists(data) {
      return splitArtists(data)
    },
    // 关闭歌手选择模态框
    handleCloseArtistsModal() {
      this.artistsModalVisible = false
    },
    /* router
    -------------------------- */
    // 跳转到专辑详情页
    handleToAlbumDetail(id) {
      wx.navigateTo({
        url: '../album-detail/index?albumId='+ id
      })
    },
    // 跳转到歌手详情页
    handleToArtistDetail(id) {
      wx.navigateTo({
        url: '../artist-detail/index?artistId='+ id
      })
    },
    // 跳转到评论页
    handleToComment(id,type) {
      wx.navigateTo({
        url: '../comment/index?id=' + id + '&type='+ type
      })
    },
    /* fetch
    -------------------------- */
    async fetchPlaylistSongs() {
      try {
        const params = {
          id: this.playlistInfo.id
        }
        return await getPlaylistDetailAPI(params)
      } catch (e) {
        console.warn(e)
      }
    },
    async fetchSongDetail() {
      try {
        const params = {
          ids: this.ids.join(',')
        }
        return await getSongDetailAPI(params)
      } catch (e) {
        console.warn(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p-playlist-detail {
  width: 100%;
  height: 100%;
  .header {
    width: 100%;
    height: 150px;
    background-color: rgba(0,0,0,.8);
    display: flex;
    &-left {
      width: 150px;
      height: 150px;
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      img {
        width: 100px;
        height: 100px;
      }
      &-count {
        position: absolute;
        top: 25px;
        right: 25px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #ffffff;
        padding-right: 5px;
        i {
          font-size: 14px;
        }
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
          display: flex;
          font-size: 14px;
          color: rgba(255, 255, 255, .4);
          &-avatar {
            img {
              width: 20px;
              height: 20px;
              border-radius: 50%;
            }
            padding-right: 10px;
          }
          &-name {
            color: #ffffff;
          }
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
          padding: 10px 15px;
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
    .list-cnt {
      // 覆写默认样式
      // 隐藏滚动条
      ::-webkit-scrollbar {
        width: 4px;
        height: 6px;
        color: transparent;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #DF4337;
      }
      width: 100%;
      height: calc(100vh - 200px);
      padding-bottom: 50px;
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
            overflow: hidden;
            white-space: nowrap;
            text-overflow:ellipsis;
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
            overflow: hidden;
            white-space: nowrap;
            text-overflow:ellipsis;
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
  }
}
</style>