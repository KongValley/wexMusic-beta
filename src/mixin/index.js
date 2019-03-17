import { initPlayArr,findSameSongIndex,splitArtists } from '_u'
import { getSongDetailAPI } from '_a/song'
export const play = {
  methods: {
    async handlePlayMusicyMusic(_) {
      initPlayArr()
      const res = await getSongDetailAPI({ids: _.id})
      const arr = wx.getStorageSync('playArr')
      const index = findSameSongIndex(arr, _.id)
      if(index === 0) {
        // 如果点击播放的音乐是当前正在播放的，那就重新播放一遍
        const audio = wx.getBackgroundAudioManager()
        audio.seek(0)
      }else {
        if (index > 0) {
        // 如果歌曲在播放列表里，就先把它从数组里删除再添加到头部
          arr.splice(index,1)
        }
        const currentMusic = {
          id: _.id,
          title: _.name,
          epname: _.albumName,
          coverImgUrl: res.data.songs[0].al.picUrl,
          singer: splitArtists(_.artists),
          src: `https://music.163.com/song/media/outer/url?id=${_.id}.mp3`
        }
        arr.unshift(currentMusic)
        wx.setStorageSync('playArr', arr)
        const audio = wx.getBackgroundAudioManager()
        audio.title = currentMusic.title
        audio.epname = currentMusic.epname
        audio.singer = currentMusic.singer
        audio.coverImgUrl = currentMusic.coverImgUrl
        audio.src = currentMusic.src
      }
    }
  }
}
