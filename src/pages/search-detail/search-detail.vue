<template>
  <div class="p-sd">
    <div class="header">
      <div class="header-text">“{{keyword}}” 的搜索结果</div>
    </div>
    <div class="center">
      <i-tabs
        :active="currentPage"
        @change="handleChangeScroll"
        custom-class="center-tabs"
        :border="false"
        color="#fff">
        <i-tab title="单曲" :title-style="titleStyle">
          <scroll-view
            class="list-cnt"
            mp:scroll-y="true"
            @scrolltolower="handleScrollToLower">
            <div class="list-item" v-for="item in result.songs.data" :key="item.id" @click="handlePlayMusic(item)">
              <div class="item-title">
                <div class="title-header">
                  <c-highlight :keyword="keyword" :str="item.name"></c-highlight>
                </div>
                <div class="title-desc">
                  <c-highlight :keyword="keyword" :str="`${handleSplitArtists(item.artists)} - ${item.album.name}`"></c-highlight>
                </div>
              </div>
              <div class="item-action" @click.stop="handleSongSheetActive(item)">
                <i class="material-icons">more_vert</i>
              </div>
            </div>
            <div v-if="result.songs.endFlag === false">
              <i-load-more></i-load-more>
            </div>
            <div v-if="result.songs.endFlag === true">
              <i-divider color="#DF4337" lineColor="#DF4337">我是有底线的 :)</i-divider>
            </div>
            <i-action-sheet
              i-class="action-sheet-circle"
              :visible="songSheetVisible"
              :actions="currentSongAction"
              @clickhook="handleClickSongSheet"
              @cancel="handleSongSheetCancel">
              <div slot="header" style="padding: 10px">
                <div>歌曲：{{currentSongInfo.name}}</div>
              </div>
            </i-action-sheet>
          </scroll-view>
        </i-tab>
        <i-tab title="专辑" :title-style="titleStyle">
          <scroll-view
            class="list-cnt"
            mp:scroll-y="true"
            @scrolltolower="handleScrollToLower">
            <div class="list-item" v-for="item in result.albums.data" :key="item.id" @click="handleToAlbumDetail(item.id)">
              <div class="item-img">
                <img :src="item.picUrl" alt="">
              </div>
              <div class="item-title">
                <div class="title-header">
                  <!--专辑名-->
                  <c-highlight :keyword="keyword" :str="item.name"></c-highlight>
                  <!--专辑别名-->
                  <div class="title-sub-header" v-if="item.alias.length > 0">
                    <c-highlight :keyword="keyword" :str="'（'+item.alias[0]+'）'"></c-highlight>
                  </div>
                </div>
                <div class="title-desc">
                  <c-highlight :keyword="keyword" :str="item.artist.name+' '+handleAlbumFormatTime(item)"></c-highlight>
                </div>
              </div>
            </div>
            <div v-if="result.albums.endFlag === false">
              <i-load-more></i-load-more>
            </div>
            <div v-if="result.albums.endFlag === true">
              <i-divider color="#DF4337" lineColor="#DF4337">我是有底线的 :)</i-divider>
            </div>
          </scroll-view>
        </i-tab>
        <i-tab title="歌手" :title-style="titleStyle">
          <scroll-view
            class="list-cnt"
            mp:scroll-y="true"
            @scrolltolower="handleScrollToLower">
            <div class="list-item" v-for="item in result.artists.data" :key="item.id" @click="handleToArtistDetail(item.id)">
              <div class="item-img">
                <img :src="item.picUrl" alt="">
              </div>
              <div class="item-title">
                <div class="title-header">
                  <!--歌手名字-->
                  <c-highlight :keyword="keyword" :str="item.name"></c-highlight>
                  <!--歌手外语名字-->
                  <div class="title-sub-header" v-if="item.alias.length > 0">
                    <c-highlight :keyword="keyword" :str="item.alias[0]"></c-highlight>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="result.artists.endFlag === false">
              <i-load-more></i-load-more>
            </div>
            <div v-if="result.artists.endFlag === true">
              <i-divider color="#DF4337" lineColor="#DF4337">我是有底线的 :)</i-divider>
            </div>
          </scroll-view>
        </i-tab>
        <i-tab title="歌单" :title-style="titleStyle">
          <scroll-view
            class="list-cnt"
            mp:scroll-y="true"
            @scrolltolower="handleScrollToLower">
            <div class="list-item" v-for="item in result.playlists.data" :key="item.id" @click="handleToPlaylistDetail(item.id)">
              <div class="item-img">
                <img :src="item.coverImgUrl" alt="">
              </div>
              <div class="item-title">
                <div class="title-header">
                  <!--歌单名-->
                  <c-highlight :keyword="keyword" :str="item.name"></c-highlight>
                </div>
                <div class="title-desc">
                  <span class="desc-header">{{`${item.trackCount}首 by `}}</span>
                  <c-highlight :keyword="keyword" :str="item.creator.nickname"></c-highlight>
                  <span>{{`，播放${item.playCount}次`}}</span>
                </div>
              </div>
            </div>
            <div v-if="result.playlists.endFlag === false">
              <i-load-more></i-load-more>
            </div>
            <div v-if="result.playlists.endFlag === true">
              <i-divider color="#DF4337" lineColor="#DF4337">我是有底线的 :)</i-divider>
            </div>
          </scroll-view>
        </i-tab>
        <i-tab title="电台" :title-style="titleStyle">
          <scroll-view
            class="list-cnt"
            mp:scroll-y="true"
            @scrolltolower="handleScrollToLower">
            <div class="list-item" v-for="item in result.djRadios.data" :key="item.id" @click="handleToDjDetail(item.id)">
              <div class="item-img">
                <img :src="item.picUrl" alt="">
              </div>
              <div class="item-title">
                <div class="title-header">
                  <!--电台名-->
                  <c-highlight :keyword="keyword" :str="item.name"></c-highlight>
                </div>
                <div class="title-desc">
                  <c-highlight :keyword="keyword" :str="item.dj.nickname"></c-highlight>
                </div>
              </div>
            </div>
            <div v-if="result.djRadios.endFlag === false">
              <i-load-more></i-load-more>
            </div>
            <div v-if="result.djRadios.endFlag === true">
              <i-divider color="#DF4337" lineColor="#DF4337">我是有底线的 :)</i-divider>
            </div>
          </scroll-view>
        </i-tab>
      </i-tabs>
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
  </div>
</template>

<script>
  import CFooterbar from '_c/footer-bar'
  import CHighlight from '_c/searchHighlight'
  import { getSearchDataAPI } from '_a/search'
  import {resultList, typeList, resultCount} from './var'
  import {formatTime, SEARCH_LIMIT, splitArtists} from '_u'
  import { playMixin } from '_mixin'
  import {getUserPlaylistAPI} from "_a/user"
  import {getPlaylistTracksAPI} from "_a/playlist"
  const { $Toast } = require('_v/base/index')
  export default {
  name: "search-detail",
  components: {
    CHighlight,
    CFooterbar
  },
  data() {
    return {
      keyword: "",
      currentPage: 0,
      titleStyle: "background:#DF4337;color:#fff;",
      currentType: 1, // 1:单曲 10:专辑 100:歌手 1000:歌单 1009: 电台
      typeList: typeList,
      // 存放获取的各个数据
      result: {
        songs: {
          // 存放偏移量 * 50
          offset: 0,
          // 存放数据
          data: [],
          // 总数
          total: 0,
          // 存放唯一id
          idList: [],
          // 是否加载完毕
          endFlag: false
        },
        albums: {
          offset: 0,
          data: [],
          total: 0,
          idList: [],
          endFlag: false
        },
        artists: {
          offset: 0,
          data: [],
          total: 0,
          idList: [],
          endFlag: false
        },
        playlists: {
          offset: 0,
          data: [],
          total: 0,
          idList: [],
          endFlag: false
        },
        djRadios: {
          offset: 0,
          data: [],
          total: 0,
          idList: [],
          endFlag: false
        }
      },
      /* common var
      -------------------------- */
      songSheetVisible: false,
      artistsModalVisible: false,
      playlistModalVisible: false,
      createdPlaylist: [],
      // 当前歌曲抽屉数据
      currentSongInfo: {
        name: "",
        id: "",
        author: "",
        albumName: "",
        albumId: "",
        artists: [],
        duration: 0
      }
      /* common end
      -------------------------- */
    };
  },
  /* common mixin
  -------------------------- */
  mixins: [playMixin],
  methods: {
    /* common methods
    -------------------------- */
    // 格式化歌手
    handleSplitArtists(data) {
      return splitArtists(data)
    },
    // 关闭模态框
    handleCloseArtistsModal() {
      this.artistsModalVisible = false
    },
    // 关闭歌曲的抽屉
    handleSongSheetCancel() {
      this.songSheetVisible = false
    },
    // 打开歌曲动作抽屉
    handleSongSheetActive(_) {
      this.currentSongInfo.name = _.name
      this.currentSongInfo.id = _.id
      this.currentSongInfo.albumName = _.album.name
      this.currentSongInfo.albumId = _.album.id
      this.currentSongInfo.artists = _.artists
      this.currentSongInfo.duration = _.duration
      this.songSheetVisible = true
    },
    // 获取点击索引
    handleClickSongSheet({detail}) {
      // console.log(_relatedInfo)
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
    handleToDjDetail(id) {
      wx.navigateTo({
        url: '../dj-detail/index?djId='+id
      })
    },
    handleToPlaylistDetail(id) {
      wx.navigateTo({
        url: '../playlist-detail/index?playlistId='+id
      })
    },
    /* common action
    -------------------------- */
    // 播放音乐
    async handlePlayMusic(_) {
      const params = {
        id: _.id,
        name: _.name,
        album: {
          id: _.album.id,
          name: _.album.name
        },
        duration: _.duration,
        artists: _.artists
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
    handleToSearch() {
      wx.redirectTo({
        url: '../search/index'
      })
    },
    /* methods
    -------------------------- */
    // 切换tab
    async handleChangeScroll({ detail }) {
      this.currentPage = detail.index
      this.currentType = typeList[detail.index]
      if(this.currentPageData.data.length === 0){
        const res = await this.fetchSearchResult(this.currentPageData.offset)
        this.currentPageData.data = res.data.result[resultList[this.currentPage]]
        this.currentPageData.total = res.data.result[resultCount[this.currentPage]]
        if(this.currentPageData.data.length === this.currentPageData.total || res.data.result[resultList[this.currentPage]].length < SEARCH_LIMIT)
          this.currentPageData.endFlag = true
        this.currentPageData.idList = res.data.result[resultList[this.currentPage]].map(val => val.id)
      }
    },
    // 格式化时间
    handleAlbumFormatTime(item) {
      if(item.containedSong) {
        return '包含单曲：'+item.containedSong
      } else {
        const date = new Date(item.publishTime)
        return formatTime(date)
      }
    },
    // 滚动条触底
    async handleScrollToLower() {
      // 如果直接是count一致那就直接显示加载完毕
      if (this.currentPageData.total === this.currentPageData.data.length)
        this.currentPageData.endFlag =true
      // 继续加载
      if(this.currentPageData.total > this.currentPageData.data.length
        && this.currentPageData.endFlag === false){
        this.currentPageData.offset = this.currentPageData.offset + 1
        const res = await this.fetchSearchResult(this.currentPageData.offset)
        if(res.data.result[resultList[this.currentPage]]) {
          const result = res.data.result[resultList[this.currentPage]].filter((el)=> {
            return this.currentPageData.idList.indexOf(el.id) < 0
          })
          // 如果筛除重复之后返回数组长度为0就表示加载完毕
          // 若 > 0 则表示仍有数据
          if(result.length > 0){
            const resultId = result.map(el=> el.id)
            this.currentPageData.data.push(...result)
            this.currentPageData.idList.push(...resultId)
          }else {
            this.currentPageData.endFlag = true
          }
        } else {
          this.currentPageData.endFlag = true
        }
      }
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
    /* fetch
    -------------------------- */
    async fetchSearchResult(offset) {
      try {
        // type [ 1:单曲 10:专辑 100:歌手 1000:歌单 1009: 电台 ]
        const params = {
          keywords: this.keyword,
          type: this.currentType,
          offset: offset * 50
        }
        return await getSearchDataAPI(params)
      } catch (e) {
        console.warn(e)
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
  async created() {
    this.keyword = this.$mp.options.search || '海阔天空'
    const res = await this.fetchSearchResult(this.currentPageData.offset)
    const playlistRes = await this.fetchUserPlaylistSync()
    this.createdPlaylist = playlistRes.data.playlist.filter(val => val.subscribed === false)
    this.currentPageData.data = res.data.result[resultList[this.currentPage]]
    this.currentPageData.total = res.data.result[resultCount[this.currentPage]]
    this.currentPageData.idList = res.data.result[resultList[this.currentPage]].map(val => val.id)
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
    currentPageData() {
      return this.result[resultList[this.currentPage]]
    }
  }
}
</script>

<style lang="scss" scoped>
.p-sd {
  position: relative;
  .header {
    display: flex;
    width: 100%;
    height: 40px;
    font-size: 16px;
    padding-left: 10px;
    padding-right: 10px;
    align-items: center;
    background-color: #DF4337;
    box-sizing: border-box;
    color: #fff;
  }
  .center {
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
    /deep/ .center-tabs {
      // 覆写默认样式
      // 隐藏滚动条
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
      .van-tabs__line.van-tabs__line {
        bottom: 8px;
      }
      .van-tab {
        box-sizing: border-box;
        padding:0;
      }

      .list-cnt {
        width: 100%;
        height: calc(100vh - 86px);
        box-sizing: border-box;
        padding-bottom: 50px;
        font-size: 14px;
        ::-webkit-scrollbar {
          width: 4px;
          height: 6px;
          color: transparent;
        }
        ::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background-color: #DF4337;
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

    }
  }
}
</style>