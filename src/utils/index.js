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