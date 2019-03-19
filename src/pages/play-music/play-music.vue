<template>
  <div class="p-music">
    <div class="header">
      <div class="header-title">
        {{ music.name ? music.name : '' }}
      </div>
      <div class="header-sub-title">
        {{ music.artists ? handleSplitArtists(music.artists) : '' }}
      </div>
    </div>
    <div class="center" v-if="music.id">
      <div class="circle" :class="{'spin': isOn}" v-if="!isShowLyric">
        <img :src="music.coverImgUrl" alt="" @click="isShowLyric = true">
      </div>
      <scroll-view v-if="isShowLyric"></scroll-view>
    </div>
    <div class="center" v-if="!music.id">
      <div class="empty">
        当前无播放歌曲 :)
      </div>
    </div>
    <div class="footer">
      <div class="footer-action-top">
        <div class="icon">
          <i class="material-icons">favorite_border</i>
        </div>
        <div class="icon">
          <i class="material-icons">sms</i>
        </div>
        <div class="icon">
          <i class="material-icons">add</i>
        </div>
      </div>
      <div class="footer-slide">
        <div class="text left">{{formatCurrentTime}}</div>
        <slider
          activeColor="#DF4337"
          block-size="12"
          :max="duration*1000"
          :value="currentTime"
          @change="handleSlideChange"
          @changing="handleSlideChanging"></slider>
        <div class="text right">{{handleFormatDuration(music.duration ? music.duration : 100*1000)}}</div>
      </div>
      <div class="footer-action-bottom">
        <div class="icon">
          <i class="material-icons">repeat</i>
        </div>
        <!--<div class="icon">-->
          <!--<i class="material-icons">repeat_one</i>-->
        <!--</div>-->
        <div class="icon" @click="handlePre">
          <i class="material-icons">skip_previous</i>
        </div>
        <div class="icon large" v-if="!isOn" @click="handleStart">
          <i class="material-icons">play_circle_outline</i>
        </div>
        <div class="icon large" v-if="isOn" @click="handleStop">
          <i class="material-icons">pause_circle_outline</i>
        </div>
        <div class="icon" @click="handleNext">
          <i class="material-icons">skip_next</i>
        </div>
        <div class="icon" @click="handleShowActionSheet">
          <i class="material-icons">queue_music</i>
        </div>
      </div>
    </div>
    <i-action-sheet :visible="sheetVisible" @cancel="handleSongSheetCancel">
      <div slot="header" style="background-color: lightcyan">
       <scroll-view mp:scroll-y="true" class="list-cnt">
         <div class="list-item" v-for="item in playlist" :key="item.id">
           <div class="item-title">
             <div class="title-header">{{item.name}}</div>
             <div class="title-empty">-</div>
             <div class="title-sub-header">{{handleSplitArtists(item.artists)}}</div>
           </div>
           <div class="item-tip">
             <i class="material-icons">headset</i>
           </div>
           <div class="item-action" @click="handleDeleteSong(item)">
             <i class="material-icons">delete_outline</i>
           </div>
         </div>
       </scroll-view>
      </div>
    </i-action-sheet>
  </div>
</template>

<script>
import { initPlayArr,splitArtists,formatDuration } from '_u'
export default {
  name: "p-music",
  data() {
    return {
      isShowLyric: false,
      sheetVisible: false,
      isOn: false,
      music: {},
      playlist: [],
      currentTime: 0,
      currentIndex: -1
    }
  },
  computed: {
    duration() {
      return this.music.duration ? this.music.duration : 100
    },
    formatCurrentTime() {
      return this.handleFormatDuration(this.currentTime)
    }
  },
  mounted() {
    initPlayArr()
    const currentId = wx.getStorageSync('playId')
    console.log('currentID'+Boolean(currentId))
    const arr = wx.getStorageSync('playArr')
    const currentMusicObj = arr.find(val => val.id = currentId)
    console.log(arr)

    // 初始化当前Music
    if(arr.length > 0 && currentMusicObj) {
      this.music = currentMusicObj
      const audio = wx.getBackgroundAudioManager()
      this.currentTime = audio.currentTime
    }

    // 初始化播放列表
    if(arr.length) {
      this.playlist = arr
    }
  },
  methods: {
    handleFormatDuration(data) {
      return formatDuration(data)
    },
    handleSongSheetCancel() {
      this.sheetVisible = false
    },
    handleShowActionSheet() {
      this.sheetVisible = true
    },
    handleSplitArtists(data) {
      return splitArtists(data)
    },
    handleDeleteSong(item) {
      const index = this.playlist.findIndex(val => val.id===item.id)
      this.playlist.splice(index,1)
      wx.setStorageSync('playArr',this.playlist)
    },
    handleNext() {
      if(this.music) {
        this.handleNextCommon()
      }else {
        this.handlePlayFirst()
      }
    },
    handlePre() {
      if(this.music) {

      }else {

      }
    },
    handleStart() {

    },
    handleStop() {

    },
    handleSlideChange({ detail }) {
      this.currentTime = detail.value
      console.log(this.currentTime)
    },
    handleSlideChanging({ detail }) {
      this.currentTime = detail.value
      if(this.music) {
        const audio = wx.getBackgroundAudioManager()
        audio.seek(this.currentTime/1000)
      }
    },
    // 公共下一首歌曲逻辑
    handleNextCommon() {
      // const audio = wx.getBackgroundAudioManager()
      // audio.onNext()
      const arr = wx.getStorageSync('playArr')
      let currentId = wx.getStorageSync('playId')
      const index = arr.findIndex(val => val.id = currentId)
      if(arr>=2 && index < arr.length - 1) {
        currentId = arr[index+1].id
        wx.setStorageSync('playId',currentId)
        this.music = arr[index+1]
        const audio = wx.getBackgroundAudioManager()
        audio.title = arr[index+1].name
        audio.epname = arr[index+1].album.name
        audio.singer = splitArtists(arr[index+1].artists)
        audio.coverImgUrl = arr[index+1].coverImgUrl
        audio.src = arr[index+1].src
      }else if (arr>=2 && index === arr.length - 1) {
        currentId = arr[0].id
        wx.setStorageSync('playId',currentId)
        this.music = arr[0]
        const audio = wx.getBackgroundAudioManager()
        audio.title = arr[0].name
        audio.epname = arr[0].album.name
        audio.singer = splitArtists(arr[0].artists)
        audio.coverImgUrl = arr[0].coverImgUrl
        audio.src = arr[0].src
      }
    },
    // 公共播放第一首逻辑
    handlePlayFirst() {
      const arr = wx.getStorageSync('playArr')
      let currentId = wx.getStorageSync('playId')
      currentId = arr[0].id
      this.music = arr[0]
      wx.setStorageSync('playId',currentId)
      const audio = wx.getBackgroundAudioManager()
      audio.title = arr[0].name
      audio.epname = arr[0].album.name
      audio.singer = splitArtists(arr[0].artists)
      audio.coverImgUrl = arr[0].coverImgUrl
      audio.src = arr[0].src
    }
  }
}
</script>

<style lang="scss" scoped>
.p-music {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #333333;
  .icon {
    color: #fff;
  }
  .list-cnt {
    width: 100%;
    height: 350px;
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
      align-items: center;
      padding: 0 10px;
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
      .item-title {
        flex: 1;
        overflow: hidden;
        display: flex;
        align-items: center;
        white-space: nowrap;
        text-overflow:ellipsis;
        .title-header {
          font-size: 16px;
          color: #000;
        }
        .title-empty {
          padding: 0 5px;
          font-size: 14px;
          color: rgba(0,0,0,.3 );
        }
        .title-sub-header {
          font-size: 14px;
          color: rgba(0,0,0,.3 );
        }
      }
      .item-tip {
        display: flex;
        align-items: center;
        padding: 10px;
        i {
          font-size: 18px;
        }
      }
      .item-action {
        display: flex;
        align-items: center;
        padding: 10px;
        i {
          font-size: 18px;
        }
      }
    }
  }
  .header {
    padding-left: 20px;
    &-title {
      color: #fff;
      font-size: 18px;
    }
    &-sub-title {
      font-size: 16px;
      color: #fff;
    }
  }
  .center {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    .empty {
      color: #ffffff;
      font-size: 24px;
    }
    .circle {
      img {
        width: 255px;
        height: 255px;
        border-radius: 50%;
        border: 5px solid rgba(255,255,255,0.8);
      }
    }
    .circle.spin {
      animation: spin 10s infinite linear;
    }
  }
  .footer {
    &-action-top {
      display: flex;
      padding: 10px 20px;
      justify-content: space-around;
      .icon {
        padding: 10px;
      }
    }
    &-action-bottom {
      display: flex;
      padding: 10px 20px;
      justify-content: space-around;
      align-items: center;
      .icon {
        padding: 10px;
      }
      .icon.large {
        i {
          font-size:40px;
        }
      }
    }
    &-slide {
      display: flex;
      align-items: center;
      .text {
        color: rgba(255,255,255,.5);
        font-size: 14px;
        text-align: center;
      }
      .right {
        padding-right: 10px;
      }
      .left {
        padding-left: 10px;
      }
      slider {
        flex: 1;
      }
    }
  }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>