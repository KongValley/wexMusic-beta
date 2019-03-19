import { initPlayArr,findSameSongIndex,isExistSameSong,splitArtists } from '_u'
import { getSongDetailAPI,getMusicLyricAPI } from '_a/song'
const { $Toast } = require('_v/base/index')
export const playMixin = {
  methods: {
    async _handlePlayMusic(_) {
      initPlayArr()
      const arr = wx.getStorageSync('playArr')
      const currentId = wx.getStorageSync('playId')
      if(_.id === currentId && currentId !== null) {
        // 如果点击播放的音乐是当前正在播放的，那就重新播放一遍
        const audio = wx.getBackgroundAudioManager()
        audio.seek(0)
      }else {
        // 获取封面
        const res = await getSongDetailAPI({ids: _.id})
        // 获取歌词
        const resp = await getMusicLyricAPI({id: _.id})
        const currentMusic = {
          id: _.id,
          name: _.name,
          album: _.album,
          lyric: resp.data.lrc.lyric,
          duration: _.duration,
          coverImgUrl: res.data.songs[0].al.picUrl,
          artists: _.artists,
          src: `https://music.163.com/song/media/outer/url?id=${_.id}.mp3`
        }
        arr.push(currentMusic)
        wx.setStorageSync('playId', _.id)
        wx.setStorageSync('playArr', arr)
        const audio = wx.getBackgroundAudioManager()
        audio.title = currentMusic.name
        audio.epname = currentMusic.album.name
        audio.singer = splitArtists(currentMusic.artists)
        audio.coverImgUrl = currentMusic.coverImgUrl
        audio.src = currentMusic.src
      }
      wx.setStorageSync('playStatus', true)
    },
    async _handleAddSong(_) {
      initPlayArr()
      const arr = wx.getStorageSync('playArr')
      const flag = isExistSameSong(arr, _.id)
      if(flag) {
        $Toast({
          content: '播放列表中存在此歌曲',
          type: 'praise'
        })
      } else {
        $Toast({
          content: '添加成功',
          type: 'success'
        })
        // 获取封面
        const res = await getSongDetailAPI({ids: _.id})
        // 获取歌词
        const resp = await getMusicLyricAPI({id: _.id})

        if(arr.length > 0) {
          arr.splice(1,0,{
            id: _.id,
            name: _.name,
            album: _.album,
            lyric: resp.data.lrc.lyric,
            duration: _.duration,
            coverImgUrl: res.data.songs[0].al.picUrl,
            artists: _.artists,
            src: `https://music.163.com/song/media/outer/url?id=${_.id}.mp3`
          })
        } else if(arr.length === 0) {
          arr.push({
            id: _.id,
            name: _.name,
            album: _.album,
            lyric: resp.data.lrc.lyric,
            duration: _.duration,
            coverImgUrl: res.data.songs[0].al.picUrl,
            artists: _.artists,
            src: `https://music.163.com/song/media/outer/url?id=${_.id}.mp3`
          })
        }
        wx.setStorageSync('playArr',arr)
      }
    }
  }
}
