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
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <scroll-view
          class="list-cnt"
          mp:scroll-y="true">
        <div class="list-item" v-for="item in songs.data" :key="item.id">
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
      <i-toast id="toast"></i-toast>
    </div>
  </div>
</template>

<script>
import {
  getAlbumAPI
 } from '_a/album'
import { splitArtists,formatTime } from '_u'
const { $Toast } = require('_v/base/index')
export default {
  name: "album-detail",
  data() {
    return {
      albumId: "",
      albumImg: "",
      albumName: "",
      albumAlias: "",
      songSheetVisible: false,
      songs: {
        // 存放数据
        data: [],
      },
      // 当前歌曲抽屉数据
      currentSongInfo: {
        name: "",
        id: "",
        author: "",
        album: "",
        albumId: "",
        artists: []
      }
    }
  },
  methods: {
    handleChangeScroll({ detail }) {
      this.currentPage = detail.index
    },
    handleClickSongSheet({detail}) {
      console.log(detail)
    },
    handleSongSheetCancel() {
      this.songSheetVisible = false
    },
    handleSongSheetActive(_) {
      this.currentSongInfo.name = _.name
      this.currentSongInfo.id = _.id
      this.currentSongInfo.album = _.al.name
      this.currentSongInfo.albumId = _.al.id
      this.currentSongInfo.artists = this.handleSplitArtists(_.ar)
      this.songSheetVisible = true
    },
    handleSplitArtists(data) {
      return splitArtists(data)
    },
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
    initInfo(data) {
      this.albumImg = data.album.picUrl
      this.albumName = data.album.name
      if(data.album.alias.length) {
        this.albumAlias = `（${data.album.alias.join('/')}）`
      }
      this.songs.data = data.songs
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
          name: '歌手：'+this.currentSongInfo.artists,
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
    this.initInfo(res.data)
  }
}
</script>

<style lang="scss" scoped>
.p-artist-detail {
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
        flex-direction: row-reverse;
        padding-right: 20px;
        .action-button {
          font-size: 14px;
          padding: 10px 25px;
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
            align-items: center;line-height: 1;
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
  }
}
</style>