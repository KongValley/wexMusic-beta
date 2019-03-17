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
              @click="handleClickSongSheet"
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
            <div class="list-item" v-for="item in result.albums.data" :key="item.id">
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
            <div class="list-item" v-for="item in result.artists.data" :key="item.id">
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
            <div class="list-item" v-for="item in result.playlists.data" :key="item.id">
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
            <div class="list-item" v-for="item in result.djRadios.data" :key="item.id">
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
      <i-toast id="toast"></i-toast>
    </div>
  </div>
</template>

<script>
  import CHighlight from '_c/searchHighlight'
  import { getSearchDataAPI } from '_a/search'
  import { getSongDetailAPI } from '_a/song'
  import {resultList, typeList} from './var'
  import { formatTime,isExistSameSong,initPlayArr,findSameSongIndex,splitArtists } from '_u'
  const { $Toast } = require('_v/base/index')
  import searchSongData from '_m/search-song.json'
  import searchAlbumData from '_m/search-album'
  import searchArtistData from '_m/search-artist'
  import searchPlaylistData from '_m/search-play-list'
  import searchDjData from '_m/search-dj'

  export default {
  name: "search-detail",
  components: {
    CHighlight
  },
  data() {
    return {
      keyword: "",
      currentPage: 0,
      titleStyle: "background:#DF4337;color:#fff;",
      currentType: 1, // 1:单曲 10:专辑 100:歌手 1000:歌单 1009: 电台
      songSheetVisible: false,
      typeList: typeList,
      // 存放获取的各个数据
      result: {
        songs: {
          // 存放偏移量
          offset: 0,
          // 存放数据
          data: [],
          // 总数（网易云这部分有问题）
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
      // 当前歌曲抽屉数据
      currentSongInfo: {
        name: "",
        id: "",
        author: "",
        album: "",
        albumId: "",
        artists: ""
      }
    };
  },
  methods: {
    handleToSearch() {
      wx.redirectTo({
        url: '../search/index'
      })
    },
    handleChangeScroll({ detail }) {
      this.currentPage = detail.index
      this.currentType = typeList[detail.index]
      if(this.currentPageData.data.length === 0)
        this.fetchSearchResult(this.currentPageData.offset)
    },
    // 打开歌曲动作抽屉
    handleSongSheetActive(_) {
      this.currentSongInfo.name = _.name
      this.currentSongInfo.id = _.id
      this.currentSongInfo.album = _.album.name
      this.currentSongInfo.albumId = _.album.id
      this.currentSongInfo.artists = this.handleSplitArtists(_.artists)
      this.songSheetVisible = true
    },
    async fetchSearchResult(offset) {
      try {
        // type [ 1:单曲 10:专辑 100:歌手 1000:歌单 1009: 电台 ]
        const params = {
          keywords: this.keyword,
          type: this.currentType,
          offset: offset
        }
        return await getSearchDataAPI(params)
      } catch (e) {
        console.warn(e)
      }
    },
    async fetchSongDetailAPI(id) {
      try {
        const params = {
          ids: id
        }
        return await getSongDetailAPI(params)
      } catch (e) {
        console.warn(e)
      }
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
          // case 3: {
          //   this.handleAddSong()
          // }
        }
      }
    },
    // 添加到下一首歌曲
    async handleAddSong() {
      initPlayArr()
      const arr = wx.getStorageSync('playArr')
      const flag = isExistSameSong(arr, this.currentSongInfo.id)

      if(flag) {
        $Toast({
          content: '播放列表已有此歌曲',
          type: 'praise'
        })
      }else {
        $Toast({
          content: '添加成功',
          type: 'success'
        })
        const res = await this.fetchSongDetailAPI(this.currentSongInfo.id)
        arr.push({
          id: this.currentSongInfo.id,
          title: this.currentSongInfo.name,
          epname: this.currentSongInfo.album,
          coverImgUrl: res.data.songs[0].al.picUrl,
          singer: this.currentSongInfo.artists,
          src: `https://music.163.com/song/media/outer/url?id=${this.currentSongInfo.id}.mp3`
        })
      }
    },
    // 格式化歌手
    handleSplitArtists(data) {
      return splitArtists(data)
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
      if(this.currentPageData.total !== this.currentPageData.data.length
        || this.currentPageData.endFlag === false){
        this.currentPageData.offset = this.currentPageData.offset + 1
        const res = await this.fetchSearchResult(this.currentPageData.offset)
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
      }
    },
    // 播放音乐
    async handlePlayMusic(_) {
      initPlayArr()
      const res = await this.fetchSongDetailAPI(_.id)
      const arr = wx.getStorageSync('playArr')
      // MARK 播放列表存储的数据结构
      const index = findSameSongIndex(arr, _.id)
      if(index > 0) {
        // 如果播放的音乐在播放列表里，把这首音乐提到数组最前
        arr.splice(index,1)
        arr.unshift({
          id: _.id,
          title: _.name,
          epname:_.album.name,
          coverImgUrl: res.data.songs[0].al.picUrl,
          singer: this.handleSplitArtists(_.artists),
          src: `https://music.163.com/song/media/outer/url?id=${_.id}.mp3`
        })
        wx.setStorageSync('playArr', arr)
        const audio = wx.getBackgroundAudioManager()
        audio.title = _.name
        audio.epname = _.album.name
        audio.singer = this.handleSplitArtists(_.artists)
        audio.coverImgUrl = res.data.songs[0].al.picUrl
        audio.src = `https://music.163.com/song/media/outer/url?id=${_.id}.mp3`
      }else if(index === 0) {
        // 如果点击播放的音乐是当前正在播放的，那就重新播放一遍
        const audio = wx.getBackgroundAudioManager()
        audio.seek(0)
      }else {
        arr.unshift({
          id: _.id,
          title: _.name,
          epname:_.album.name,
          coverImgUrl: res.data.songs[0].al.picUrl,
          singer: this.handleSplitArtists(_.artists),
          src: `https://music.163.com/song/media/outer/url?id=${_.id}.mp3`
        })
        wx.setStorageSync('playArr', arr)
        const audio = wx.getBackgroundAudioManager()
        audio.title = _.name
        audio.epname = _.album.name
        audio.singer = this.handleSplitArtists(_.artists)
        audio.coverImgUrl = res.data.songs[0].al.picUrl
        audio.src = `https://music.163.com/song/media/outer/url?id=${_.id}.mp3`
      }
    }
  },
  created() {
    this.keyword = this.$mp.options.search
    this.keyword = '海阔天空'
    this.result.songs.data = searchSongData.result.songs
    this.result.songs.idList = this.result.songs.data.map(el=> el.id)
    this.result.songs.total = searchSongData.result.songCount
    this.result.albums.data = searchAlbumData.result.albums
    this.result.albums.idList = this.result.albums.data.map(el=> el.id)
    this.result.artists.data = searchArtistData.result.artists
    this.result.playlists.data = searchPlaylistData.result.playlists
    this.result.djRadios.data = searchDjData.result.djRadios
    this.result.djRadios.total = searchDjData.result.djRadiosCount
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
            .title-header {
              font-size: 14px;
              display: flex;
              align-items: center;line-height: 1;
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
              line-height: 1;
              align-items: center;
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