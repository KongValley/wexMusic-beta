<template>
  <div class="c-footer-bar">
    <div class="item">
      <i class="material-icons" @click="handleToHome">home</i>
    </div>
    <div class="item">
      <i class="material-icons" @click="handleToPlayMusic">headset</i>
    </div>
  </div>
</template>

<script>
  import {splitArtists} from "_u"

  export default {
    name: "footer-bar",
    methods: {
      handleToPlayMusic() {
        wx.navigateTo({
          url: '../../pages/play-music/index'
        })
      },
      handleToHome() {
        wx.navigateTo({
          url: '../../pages/home/index'
        })
      }
    },
    mounted() {
      const audio = wx.getBackgroundAudioManager()
      audio.onEnded(()=>{
        const mode  = wx.getStorageSync('playMode')
        if(mode === 'single') {
          audio.seek(0)
        }else if(mode === 'multiple'){
          let arr = wx.getStorageSync('playArr')
          let currentId = wx.getStorageSync('playId')
          const index = arr.findIndex(val => val.id === currentId)

          if(arr.length>=2) {
            currentId = arr[(index+1) % arr.length].id
            const music = arr[(index+1) % arr.length]
            wx.setStorageSync('playId',currentId)
            arr.splice(index,1)
            wx.setStorageSync('playArr',arr)
            audio.title = music.name
            audio.epname = music.album.name
            audio.singer = splitArtists(music.artists)
            audio.coverImgUrl = music.coverImgUrl
            audio.src = music.src
          } else {
            wx.setStorageSync('playId','')
            arr.splice(index,1)
            wx.setStorageSync('playArr',arr)
          }
        }
      })
      audio.onNext(()=> {
        const arr = wx.getStorageSync('playArr')
        let currentId = wx.getStorageSync('playId')
        const index = arr.findIndex(val => val.id === currentId)
        if(arr.length >=2 && index < arr.length - 1) {
          console.log(arr[index +1 ])
          const music = arr[index+1]
          currentId = music.id
          wx.setStorageSync('playId',currentId)
          audio.title = music.name
          audio.epname = music.album.name
          audio.singer = splitArtists(music.artists)
          audio.coverImgUrl = music.coverImgUrl
          audio.src = music.src
        }else if (arr.length >=2 && index === arr.length - 1) {
          const music = arr[0]
          currentId = music.id
          wx.setStorageSync('playId',currentId)
          audio.title = music.name
          audio.epname = music.album.name
          audio.singer = splitArtists(music.artists)
          audio.coverImgUrl = music.coverImgUrl
          audio.src = music.src
        }
      })
      audio.onPrev(()=> {
        const arr = wx.getStorageSync('playArr')
        let currentId = wx.getStorageSync('playId')
        const index = arr.findIndex(val => val.id === currentId)
        if(arr.length >=2 && index > 0) {
          const music = arr[index-1]
          currentId = music.id
          wx.setStorageSync('playId',currentId)
          audio.title = music.name
          audio.epname = music.album.name
          audio.singer = splitArtists(music.artists)
          audio.coverImgUrl =music.coverImgUrl
          audio.src = music.src
        }else if (arr.length>=2 && index === 0) {
          const music = arr[arr.length-1]
          currentId = music.id
          wx.setStorageSync('playId',currentId)
          const audio = wx.getBackgroundAudioManager()
          audio.title = music.name
          audio.epname = music.album.name
          audio.singer = splitArtists(music.artists)
          audio.coverImgUrl = music.coverImgUrl
          audio.src = music.src
        }
      })
    },
    beforeDestroy() {
      const audio = wx.getBackgroundAudioManager()
      if(audio.src) {
        audio.onPlay(function() {})
        audio.onPause(function() {})
        audio.onPrev(function () {})
        audio.onNext(function () {})
      }
    }
  }
</script>

<style lang="scss" scoped>
.c-footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #DF4337;
  box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
  .item {
    color: #fff;
    padding: 10px;
  }
}
</style>