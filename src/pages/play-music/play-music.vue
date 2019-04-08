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
        <img :src="music.coverImgUrl" alt="" @click="handleSwitchPane">
      </div>
      <scroll-view
        v-if="isShowLyric && lyric.lines.length"
        @click="handleSwitchPane"
        :mp:scroll-into-view="currentLyricLine"
        mp:scroll-y="true"
        mp:scroll-with-animation="true"
        class="lyric-cnt">
        <div
          :id="'lyric-' + (i-5)"
          class="lyric-line"
          v-for="i in 4"
          :key="`lyric-${i-5}`"
          >
        </div>
        <div
          :id="'lyric-'+index"
          class="lyric-line"
          v-for="(item,index) in lyric.lines"
          :key="item.index"
          :class="{'lyric-high-light': 'lyric-' + (index - 4) === currentLyricLine}">
          {{ item.txt }}
        </div>
        <div
          :id="'lyric-'+ (lyric.lines.length + i - 1)"
          class="lyric-line"
          v-for="i in 4"
          :key="`lyric-${lyric.lines.length + i - 1}`"></div>
      </scroll-view>
    </div>
    <div class="center" v-if="!music.id">
      <div class="empty">
        当前无播放歌曲 :)
      </div>
    </div>
    <div class="footer">
      <div class="footer-action-top">
        <div class="icon" @click="handleLikeMusic(music)">
          <i class="material-icons" v-if="!likeMusicList.includes(music.id)">favorite_border</i>
          <i class="material-icons" v-if="likeMusicList.includes(music.id)">favorite</i>
        </div>
        <div class="icon" @click="handleToComment(music.id)">
          <i class="material-icons">sms</i>
        </div>
        <div class="icon" @click="handleShowPlaylistModal">
          <i class="material-icons">add</i>
        </div>
      </div>
      <div class="footer-slide">
        <div class="text left">{{ formatCurrentTime }}</div>
        <slider
          activeColor="#DF4337"
          block-size="12"
          :max="music.duration"
          :value="currentTime"
          @change="handleSlideChange"
          @changing="handleSlideChanging"></slider>
        <div class="text right">{{handleFormatDuration(music.duration)}}</div>
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
         <div class="list-item" v-for="item in playlist" :key="item.id" @click="handleSwitchSong(item)">
           <div class="item-title">
             <div class="title-header">{{item.name}}</div>
             <div class="title-empty">-</div>
             <div class="title-sub-header">{{handleSplitArtists(item.artists)}}</div>
           </div>
           <div class="item-tip" v-if="music.id === item.id">
             <i class="material-icons">headset</i>
           </div>
           <div class="item-action" @click.stop="handleDeleteSong(item)">
             <i class="material-icons">delete_outline</i>
           </div>
         </div>
       </scroll-view>
      </div>
    </i-action-sheet>
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
  </div>
</template>

<script>
import {
  likeMusicAPI,
  getLikeMusicListAPI,
  getUserPlaylistAPI
} from '_a/user'
import {
  initPlayArr,
  splitArtists,
  formatDuration
} from '_u'
import Lyric from 'lyric-parser'
import { getPlaylistTracksAPI } from "_a/playlist"
export default {
  name: "p-music",
  data() {
    return {
      isShowLyric: false,
      sheetVisible: false,
      isOn: false,
      playlistModalVisible: false,
      createdPlaylist: [],
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
      currentLyricLine: 'lyric--4',
      lyric: null,
      likeMusicList: []
    }
  },
  computed: {
    duration() {
      return this.music.duration ? this.music.duration : 100
    },
    formatCurrentTime() {
      return this.handleFormatDuration(this.currentTime)
    },
  },
  async mounted() {
    const likeMusicList = wx.getStorageSync('likeMusicList')
    const uid = wx.getStorageSync('uid')

    const playlistRes = await this.fetchUserPlaylistSync()
    this.createdPlaylist = playlistRes.data.playlist.filter(val => val.subscribed === false)
    if(likeMusicList) {
      this.likeMusicList = likeMusicList
    }else {
      getLikeMusicListAPI({uid: uid}).then(res => {
        this.likeMusicList = res.data.ids
      })
    }
    if(wx.getStorageSync('playMode'))
      wx.setStorageSync('playMode','multiple')
    this.mode = wx.getStorageSync('playMode')
    // 初始化播放模式
    const type = wx.getStorageSync('playType')
    // 判断电台是否在播放
    if(type === 'dj') {
      wx.redirectTo({
        url: '../play-dj/index'
      })
    }else {
      initPlayArr()
      const currentId = wx.getStorageSync('playId')
      console.log('currentId:',currentId)
      const arr = wx.getStorageSync('playArr')
      const currentMusicObj = arr.find(val => val.id === currentId)
      /* Debug
      -------------------------- */
      console.log('currentMusicObj')
      console.log(currentMusicObj)
      console.log('arr')
      console.log(arr)

      const audio = wx.getBackgroundAudioManager()

      // 初始化当前Music
      if(arr.length > 0 && currentMusicObj) {
        this.music = currentMusicObj
        this.lyric = new Lyric(this.music.lyric,this.handleLyricPlay)
      }
      console.log(this.music)
      console.log('lyric')
      console.log(this.lyric)

      if(audio.src) {
        console.log('playing...')
        this.currentTime = Math.floor(audio.currentTime * 1000)
        this.isOn = !audio.paused;
        this.lyric.seek(this.currentTime)
        if(!this.isOn) this.lyric.stop()
      }

      // 初始化播放列表
      if(arr.length) {
        this.playlist = arr
        console.log('mounted playlist',this.playlist)
      }

      // 添加监听事件
      audio.onTimeUpdate(this.handleUpdateTime)
      audio.onPause(this.handleOnStop)
      audio.onPlay(this.handleOnPlay)
      audio.onEnded(this.handleOnEnd)
    }

  },
  beforeDestroy() {
    console.log('destroy')
    if(this.lyric)
      this.lyric.stop()
    // 移除监听
    const audio = wx.getBackgroundAudioManager()
    audio.onTimeUpdate(function(){})
    audio.onPlay(function(){})
    audio.onPause(function(){})
  },
  methods: {
    handleSwitchPane() {
      if(this.lyric.lines.length)
        this.isShowLyric = !this.isShowLyric
      else {
        $Toast({
          content: '网易云未提供有效歌词',
          type: 'warning'
        })
      }
    },
    handleLikeMusic(val) {
      if(!this.music.src)
        return
      if (this.likeMusicList.includes(val.id)) {
        this.fetchLikeMusic({
          id: val.id,
          like: false
        }).then(() => {
          const index = this.likeMusicList.findIndex(value => value === val.id)
          if(index > -1) {
            this.likeMusicList.splice(index,1)
          }
        })
      }else {
        this.fetchLikeMusic({
          id: val.id,
          like: true
        }).then(() => {
          this.likeMusicList.push(val.id)
        })
      }
    },
    handleFormatDuration(data) {
      return formatDuration(data)
    },
    async fetchLikeMusic(val) {
      const { id,like } = val
      try {
        return await likeMusicAPI({
          id: id,
          like: like
        })
      }catch (e) {
        console.warn(e)
      }
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
    async handleStart() {
      if (!this.music.src)
        return
      this.isOn = true
      const audio = wx.getBackgroundAudioManager()
      if(!audio.src && this.music.src) {
        audio.title = this.music.name
        audio.epname = this.music.album.name
        audio.singer = splitArtists(this.music.artists)
        audio.coverImgUrl = this.music.coverImgUrl
        audio.src = this.music.src
        console.log('handleStart:start lyric')
        if(this.lyric)
          this.lyric.stop()
        this.currentLyricLine = 'lyric--4'
        this.lyric = new Lyric(this.music.lyric,this.handleLyricPlay)
        this.lyric.seek(0)
        wx.setStorageSync('playId',this.music.id)
      }
      if(this.music.src && audio.src) {
        console.log("paused")
        console.log(audio.paused)
        if(this.music.src !== audio.src) {
          audio.title = this.music.name
          audio.epname = this.music.album.name
          audio.singer = splitArtists(this.music.artists)
          audio.coverImgUrl = this.music.coverImgUrl
          audio.src = this.music.src
          if(this.lyric)
            this.lyric.stop()
          this.currentLyricLine = 'lyric--4'
          this.lyric = new Lyric(this.music.lyric,this.handleLyricPlay)
          this.lyric.seek(0)
          wx.setStorageSync('playId',this.music.id)
        }
        if(audio.paused) {
          audio.play()
          if(this.lyric)
            this.lyric.stop()
          this.lyric.seek(this.currentTime)
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
          this.lyric.stop()
        }
      }
    },
    handleSlideChange({ detail }) {
      console.log('change')
      this.currentTime = detail.value
      const audio = wx.getBackgroundAudioManager()
      if(this.music.src && audio.src) {
        const audio = wx.getBackgroundAudioManager()
        audio.seek(this.currentTime / 1000)
        audio.onTimeUpdate(this.handleUpdateTime)
        this.lyric.stop()
        this.lyric.seek(this.currentTime)
      }
    },
    handleSlideChanging({ detail }) {
      console.log('changing')
      const audio  = wx.getBackgroundAudioManager()
      audio.onTimeUpdate(()=>{})
      this.currentTime = detail.value
    },
    handleUpdateTime() {
      const audio = wx.getBackgroundAudioManager()
      this.currentTime = audio.currentTime * 1000
    },
    handleLyricPlay({lineNum}) {
      this.currentLyricLine = 'lyric-' + (lineNum - 4)
      console.log(lineNum)
    },
    handleChangeMode() {
      if(this.mode === 'multiple') {
        this.mode = 'single'
        wx.setStorageSync('playMode', 'single')
      }
      else {
        this.mode = 'multiple'
        wx.setStorageSync('playMode', 'multiple')
      }
    },
    handleSwitchSong(_) {
      console.log('switch')
      this.music = _
      this.sheetVisible = false
      this.handleStart()
    },
    // 公共下一首歌曲逻辑
    handleNextCommon() {
      this.currentTime = 0
      const arr = wx.getStorageSync('playArr')
      let currentId = wx.getStorageSync('playId')

      const index = arr.findIndex(val => val.id === currentId)
      if(arr.length >=2 && index < arr.length - 1) {
        console.log(arr[index +1 ])
        this.music = arr[index+1]
        this.isOn = true
        currentId = this.music.id
        wx.setStorageSync('playId',currentId)
        const audio = wx.getBackgroundAudioManager()
        audio.title =this.music.name
        audio.epname = this.music.album.name
        audio.singer = splitArtists(this.music.artists)
        audio.coverImgUrl = this.music.coverImgUrl
        audio.src = this.music.src
        console.log('next: ',this.lyric)
        if(this.lyric)
          this.lyric.stop()
        this.lyric = new Lyric(this.music.lyric,this.handleLyricPlay)
        this.lyric.seek(0)

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
        console.log('next: ',this.lyric)
        if(this.lyric)
          this.lyric.stop()
        this.lyric = new Lyric(this.music.lyric,this.handleLyricPlay)
        this.lyric.seek(0)
      }
    },
    // 公共上一首歌曲逻辑
    handlePreCommon() {
      if(!this.music.src)
        return
      this.currentTime = 0
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
        if(this.lyric)
          this.lyric.stop()
        this.lyric = new Lyric(this.music.lyric,this.handleLyricPlay)
        this.lyric.seek(0)
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
        if(this.lyric)
          this.lyric.stop()
        this.lyric = new Lyric(this.music.lyric,this.handleLyricPlay)
        this.lyric.seek(0)

      }
    },
    // 公共播放第一首逻辑
    handlePlayFirst() {
      if(!this.music.src)
        return
      const arr = wx.getStorageSync('playArr')
      console.log('arr')
      console.log(arr)
      if(arr.length) {
        let currentId = wx.getStorageSync('playId')
        this.music = arr[0]
        console.log(arr[0].lyric)
        console.log(this.music.lyric)
        this.isOn = true
        currentId = this.music.id
        wx.setStorageSync('playId',currentId)
        const audio = wx.getBackgroundAudioManager()
        audio.title = this.music.name
        audio.epname = this.music.album.name
        audio.singer = splitArtists(this.music.artists)
        audio.coverImgUrl = this.music.coverImgUrl
        audio.src = this.music.src
        if(this.lyric)
          this.lyric.stop()
        this.lyric = new Lyric(this.music.lyric,this.handleLyricPlay)
        this.lyric.seek(0)
      }else {
        wx.setStorageSync('playId', '')
        this.music = {
          id: "",
          name: "",
          album: "",
          lyric: "",
          duration: 0,
          coverImgUrl: "",
          artists: "",
          src: ""
        }
        if(this.lyric)
          this.lyric.stop()
      }
    },
    handleOnEnd() {
      console.log('触发了end事件')
      if(this.lyric)
        this.lyric.stop()
      const mode  = wx.getStorageSync('playMode')
      if(mode === 'single') {
        const audio = wx.getBackgroundAudioManager()
        audio.seek(0)
        this.lyric.seek(0)
      }else if(mode === 'multiple'){
        let arr = wx.getStorageSync('playArr')
        let currentId = wx.getStorageSync('playId')
        const index = arr.findIndex(val => val.id === currentId)

        if(arr.length>=2) {
          currentId = arr[(index+1) % arr.length].id
          this.music = arr[(index+1) % arr.length]
          wx.setStorageSync('playId',currentId)
          arr.splice(index,1)
          wx.setStorageSync('playArr',arr)
          this.playlist = arr
          this.handleStart()
        } else {
          arr.splice(index,1)
          wx.setStorageSync('playArr',arr)
          this.handlePlayFirst()
        }

      }
    },
    handleOnStop() {
      console.log('触发了stop事件')
      if(this.isOn) {
        this.isOn = false
        this.lyric.stop()
      }
    },
    handleOnPlay() {
      console.log('触发了play事件')
      console.log(this.isOn)
      if(!this.isOn) {
        this.isOn = true
        this.lyric.seek(this.currentTime)
      }
    },
    handleShowPlaylistModal() {
      if(!this.music.src)
        return
      this.playlistModalVisible = true
    },
    handleClosePlaylistModal() {
      this.playlistModalVisible = false
    },
    async handleAddToPlaylist(el) {
      if(!this.music.src)
        return
      const res = await this.fetchPlaylistTracks({
        pid: el.id,
        tracks: this.music.id})
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
    /* common router to comment
    -------------------------- */
    // 跳转到评论页
    handleToComment(id,type = 'music') {
      if(!this.music.src)
        return
      wx.navigateTo({
        url: '../comment/index?id=' + id + '&type='+ type
      })
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
        color: #DF4337;
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
        line-height: 30px;
        min-height: 30px;
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
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>