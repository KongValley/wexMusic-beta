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
        <img :src="music.coverImgUrl" alt="" @click="isShowLyric = !isShowLyric">
      </div>
      <scroll-view
        v-if="isShowLyric && lyric.lines.length"
        @click="isShowLyric = !isShowLyric"
        :mp:scroll-into-view="currentLyricLine"
        mp:scroll-y="true"
        mp:scroll-with-animation="true"
        class="lyric-cnt">
        <div
          :id="'lyric-'+index"
          class="lyric-line"
          v-for="(item,index) in lyric.lines"
          :key="item.time"
          :class="{'lyric-high-light': 'lyric-' + index === currentLyricLine}">
          {{ item.txt }}
        </div>
      </scroll-view>
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
        <div class="text left">{{ formatCurrentTime }}</div>
        <slider
          activeColor="#DF4337"
          block-size="12"
          :max="duration"
          :value="currentTime"
          @change="handleSlideChange"
          @changing="handleSlideChanging"></slider>
        <div class="text right">{{handleFormatDuration(music.duration ? music.duration : 0)}}</div>
      </div>
      <div class="footer-action-bottom">
        <div class="icon" @click="handleChangeMode">
          <i class="material-icons" v-if="mode === 'single'">repeat_one</i>
          <i class="material-icons" v-if="mode === 'multiple'">repeat</i>
        </div>
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
import Lyric from 'lyric-parser'
export default {
  name: "p-music",
  data() {
    return {
      isShowLyric: false,
      sheetVisible: false,
      isOn: false,
      music: {
        id: "",
        name: "",
        album: "",
        lyric: "",
        duration: 0,
        coverImgUrl: "",
        artists: "",
        src: ""
      },
      playlist: [],
      currentTime: 0,
      currentIndex: -1,
      mode: 'multiple', // multiple:循环播放 single:单曲循环
      currentLyricLine: 'lyric--1'
    }
  },
  computed: {
    duration() {
      return this.music.duration ? this.music.duration : 100
    },
    formatCurrentTime() {
      return this.handleFormatDuration(this.currentTime)
    },
    lyric() {
      return this.music.lyric ? new Lyric(this.music.lyric,this.handleLyricPlay) : []
    }
  },
  mounted() {
    const type = wx.getStorageSync('playType')
    if(type === 'dj') {
      wx.redirectTo({
        url: '../play-dj/index'
      })
    }
    initPlayArr()
    const currentId = wx.getStorageSync('playId')
    console.log('currentId:',currentId)
    const arr = wx.getStorageSync('playArr')
    const currentMusicObj = arr.find(val => val.id === currentId)
    console.log('currentMusicObj')
    console.log(currentMusicObj)
    console.log(arr)
    const audio = wx.getBackgroundAudioManager()
    console.log('lyric')
    console.log(this.lyric)
    audio.onTimeUpdate(this.handleUpdateTime)
    // 初始化当前Music
    if(arr.length > 0 && currentMusicObj) {
      this.music = currentMusicObj
    }
    console.log('lyric')
    console.log(this.lyric)

    if(audio.src) {
      console.log('playing...')
      this.currentTime = Math.floor(audio.currentTime)
      this.isOn = true
      this.lyric.seek(this.currentTime)
    }

    // 初始化播放列表
    if(arr.length) {
      this.playlist = arr
    }
  },
  beforeDestroy() {
    console.log('destroy')
    this.lyric.stop()
    // 移除监听
    const audio = wx.getBackgroundAudioManager()
    audio.onTimeUpdate(function(){})
    audio.onPlay(function(){})
    audio.onPause(function(){})
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
      console.log('click next')
      if(this.music.src) {
        this.handleNextCommon()
      }else {
        this.handlePlayFirst()
      }
    },
    handlePre() {
      console.log('click next')
      if(this.music.src) {
        this.handlePreCommon()
      }else {
        this.handlePlayFirst()
      }
    },
    handleStart() {
      this.isOn = true
      const audio = wx.getBackgroundAudioManager()
      if(!audio.src && this.music.src) {
        audio.title = this.music.name
        audio.epname = this.music.album.name
        audio.singer = splitArtists(this.music.artists)
        audio.coverImgUrl = this.music.coverImgUrl
        audio.src = this.music.src
        wx.setStorageSync('playId',this.music.id)
      }
      if(this.music.src && audio.src) {

        console.log("paused")
        console.log(audio.paused)
        if(audio.paused) {
          audio.play()
          this.lyric.togglePlay()
        }
      }

      if(!audio.src && !this.music.src) {
        this.handlePlayFirst()
      }
    },
    handleStop() {
      this.isOn = false
      if(this.music.src) {
        const audio = wx.getBackgroundAudioManager()
        if(!audio.paused) {
          audio.pause()
          this.lyric.seek(Math.floor(audio.currentTime))
          this.lyric.stop()
        }
      }
    },
    handleSlideChange({ detail }) {
      this.currentTime = detail.value
      if(this.music.src) {
        const audio = wx.getBackgroundAudioManager()
        audio.seek(this.currentTime / 1000)
        audio.play()
        audio.onTimeUpdate(this.handleUpdateTime)
      }
    },
    handleSlideChanging({ detail }) {
      const audio  = wx.getBackgroundAudioManager()
      audio.onTimeUpdate(function(){})
      this.currentTime = detail.value
    },
    handleUpdateTime() {
      const audio = wx.getBackgroundAudioManager()
      this.currentTime = Math.floor(audio.currentTime * 1000)
    },
    handleLyricPlay({lineNum,txt}) {
      console.log(txt)
      console.log(lineNum)
      this.currentLyricLine = 'lyric-'+lineNum
    },
    handleChangeMode() {
      if(this.mode === 'multiple')
        this.mode = 'single'
      else
        this.mode = 'multiple'
    },
    // 公共下一首歌曲逻辑
    handleNextCommon() {
      const arr = wx.getStorageSync('playArr')
      let currentId = wx.getStorageSync('playId')
      const index = arr.findIndex(val => val.id === currentId)
      console.log(index)
      if(arr.length >=2 && index < arr.length - 1) {
        this.music = arr[index+1]
        this.isOn = true
        console.log(this.music)
        currentId = this.music.id
        wx.setStorageSync('playId',currentId)
        const audio = wx.getBackgroundAudioManager()
        audio.title =this.music.name
        audio.epname = this.music.album.name
        audio.singer = splitArtists(this.music.artists)
        audio.coverImgUrl = this.music.coverImgUrl
        audio.src = this.music.src
      }else if (arr.length >=2 && index === arr.length - 1) {
        this.music = arr[0]
        this.isOn = true
        currentId = this.music.id
        wx.setStorageSync('playId',currentId)
        const audio = wx.getBackgroundAudioManager()
        audio.title = this.music.name
        audio.epname = this.music.album.name
        audio.singer = splitArtists(this.music.artists)
        audio.coverImgUrl = this.music.coverImgUrl
        audio.src = this.music.src
      }
    },
    // 公共上一首歌曲逻辑
    handlePreCommon() {
      const arr = wx.getStorageSync('playArr')
      let currentId = wx.getStorageSync('playId')
      const index = arr.findIndex(val => val.id === currentId)
      if(arr.length >=2 && index > 0) {
        this.music = arr[index-1]
        this.isOn = true
        currentId =this.music.id
        wx.setStorageSync('playId',currentId)
        const audio = wx.getBackgroundAudioManager()
        audio.title = this.music.name
        audio.epname = this.music.album.name
        audio.singer = splitArtists(this.music.artists)
        audio.coverImgUrl =this.music.coverImgUrl
        audio.src = this.music.src
      }else if (arr.length>=2 && index === 0) {
        this.music = arr[arr.length-1]
        this.isOn = true
        currentId = this.music.id
        wx.setStorageSync('playId',currentId)
        const audio = wx.getBackgroundAudioManager()
        audio.title = this.music.name
        audio.epname = this.music.album.name
        audio.singer = splitArtists(this.music.artists)
        audio.coverImgUrl = this.music.coverImgUrl
        audio.src = this.music.src
      }
    },
    // 公共播放第一首逻辑
    handlePlayFirst() {
      const arr = wx.getStorageSync('playArr')
      console.log('arr')
      console.log(arr)
      let currentId = wx.getStorageSync('playId')
      this.music = arr[0]
      this.isOn = true
      console.log('music' + this.music)
      currentId = this.music.id
      wx.setStorageSync('playId',currentId)
      const audio = wx.getBackgroundAudioManager()
      audio.title = this.music.name
      audio.epname = this.music.album.name
      audio.singer = splitArtists(this.music.artists)
      audio.coverImgUrl = this.music.coverImgUrl
      audio.src = this.music.src
    }
  },
  watch: {
    currentTime() {
      console.log(this.currentTime)
      this.lyric.seek(this.currentTime)
      this.lyric.stop()
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
    .lyric-cnt {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      ::-webkit-scrollbar {
        width: 4px;
        height: 6px;
        color: transparent;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #DF4337;
      }
      .lyric-line {
        box-sizing: border-box;
        font-size: 14px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: rgba(255,255,255,.6);
        transition: all .5s;
      }
      .lyric-high-light {
        color: #fff;
        font-size: 16px;
      }
    }
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