<template>
  <div class="p-play-recently">
    <div class="list-item" v-for="item in weekData" :key="item.song.id" @click="handlePlayMusic(item.song)">
      <div class="item-title">
        <div class="title-header">
          {{item.song.name}}
        </div>
        <div class="title-desc">
          {{`${handleSplitArtists(item.song.ar)} - ${item.song.al.name}`}}
        </div>
      </div>
      <div class="item-action" @click.stop="handleSongSheetActive(item.song)">
        <i class="material-icons">more_vert</i>
      </div>
    </div>
    <i-action-sheet
      i-class="action-sheet-circle"
      :visible="songSheetVisible"
      :actions="currentSongAction"
      @click="handleClickSongSheet"
      @cancel="handleSongSheetCancel">
      <div slot="header" style="padding: 10px">
        <div>歌曲：{{currentSongInfo.name}}</div>
      </div>
    </i-action-sheet>
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
    <i-toast id="toast"></i-toast>
    <c-footerbar></c-footerbar>
  </div>
</template>

<script>
import CFooterbar from '_c/footer-bar'
import { getUserRecordAPI,getUserPlaylistAPI } from '_a/user';
import { getPlaylistTracksAPI } from '_a/playlist'
import { splitArtists } from '_u'
import { playMixin } from '_mixin'
const { $Toast } = require('_v/base/index')
export default {
  name: 'p-play-recently',
  components: {
    CFooterbar
  },
  data() {
    return {
      weekData: [],
      createdPlaylist: [],
      songSheetVisible: false,
      artistsModalVisible: false,
      playlistModalVisible: false,
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
  // mixin~in~~in!
  mixins: [playMixin],
  mounted() {
    this.mountedInit()
  },
  methods: {
    /* mounted
    -------------------------- */
    async mountedInit() {
      const res = await this.fetchUserRecord()
      const playlistRes = await this.fetchUserPlaylist()
      this.createdPlaylist = playlistRes.data.playlist.filter(val => val.subscribed === false)
      this.weekData = res.data.weekData
    },
    /* methods
    -------------------------- */
    // 格式化歌手
    handleSplitArtists(data) {
      return splitArtists(data)
    },
    // 关闭歌手选择模态框
    handleCloseArtistsModal() {
      this.artistsModalVisible = false
    },
    handleClosePlaylistModal() {
      this.playlistModalVisible = false
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
    async handleAddToPlaylist(el) {
      const res = await this.fetchPlaylistTracks({
        pid: el.id,
        tracks: this.currentSongInfo.id})
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
    /* common action
   -------------------------- */
    // 播放音乐
    async handlePlayMusic(_) {
      console.log(_)
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
    handleToComment(id,type = 'music') {
      wx.navigateTo({
        url: '../comment/index?id=' + id + '&type='+ type
      })
    },
    /* fetch
    -------------------------- */
    async fetchUserRecord() {
      try {
        const params = {
          uid: wx.getStorageSync('uid')
        }
        return await getUserRecordAPI(params)
      } catch (e) {

      }
    },
    /* common fetch playlist
    -------------------------- */
    async fetchUserPlaylist() {
      try {
        const uid = wx.getStorageSync('uid')
        const params ={
          uid: uid
        }
        return await getUserPlaylistAPI(params)
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
          name: '专辑：'+this.currentSongInfo.albumName,
          icon: 'createtask'
        },
      ]
    },
  }
}
</script>

<style lang="scss" scoped>
.p-play-recently {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 50px;
  ::-webkit-scrollbar {
    width: 4px;
    height: 6px;
    color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #DF4337;
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
        align-items: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
        display: flex;
        .title-sub-header {
          padding-left: 5px;
          color: rgba(0,0,0,.3);
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
        .desc-header {
          padding-right: 5px;
        }
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
</style>
