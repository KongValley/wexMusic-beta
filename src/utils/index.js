// 用于vue的props验证
export const oneOfList = (value, valueList) => {
  valueList.map((_val) => { if (_val === value) return true })
  return false
}

// 函数节流
export function throttle(fn,delay = 1000) {
  let _lastTime = null
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > delay || !_lastTime) {
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }
  }
}

// 格式化日期
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  return [year, month, day].join('.')
}

// 格式化歌曲时长
export const formatDuration = (time) => {
  const hour = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const min = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
  const sec = parseInt(time % (1000 * 60)/ 1000);
  const arr = []
  if(hour > 0 && hour < 10) {
    arr.push('0'+hour)
  }else if(hour >=10) {
    arr.push(hour)
  }
  if(min >= 0 && min < 10) {
    arr.push('0'+min)
  }else if(min >=10) {
    arr.push(min)
  }
  if(sec >= 0 && sec < 10) {
    arr.push('0'+sec)
  }else if(sec >=10) {
    arr.push(sec)
  }
  return arr.join(':')
}

// 初始化播放列表
export const initPlayArr = () => {
  if(!wx.getStorageSync('playArr')) {
    wx.setStorageSync('playArr', [])
  }
  if (typeof wx.getStorageSync('playId') === 'undefined') {
    wx.setStorageSync('playId',null)
  }
}

// 是否存在相同歌曲
export const isExistSameSong = (arr,id) => arr.findIndex(val => val.id === id) >= 0

// 相同歌曲存在的位置
export const findSameSongIndex = (arr,id) => arr.findIndex(val => val.id=== id)

// 多个歌手名格式化为xx/yy/zz的形式
export const splitArtists = (data) => {
  if (typeof data === 'object' && data instanceof Array) {
    if(data.length > 4) {
      return data.map(_ => _.name).slice(0, 4).join('/')+'等'
    }else
      return data.map(_ => _.name).join('/')
  }else
    console.warn('You need give me Array, OK?')
}
