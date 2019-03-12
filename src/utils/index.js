export const oneOfList = (value, valueList) => {
  valueList.map((_val) => { if (_val === value) return true })
  return false
}

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

export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  return [year, month, day].join('.')
}

export const initPlayArr = () => {
  if(!wx.getStorageSync('playArr')) {
    wx.setStorageSync('playArr', [])
  }
}

export const isExistSameSong = (arr,id) => arr.findIndex(val => val.id === id) >= 0

export const findSameSongIndex = (arr,id) => arr.findIndex(val => val.id=== id)
