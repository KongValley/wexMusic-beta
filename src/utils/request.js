import Fly from 'flyio/dist/npm/wx'
const fly = new Fly()

/** @namespace fly.request */
/** @namespace fly.config */
/** @namespace fly.interceptors */
/**
 * 沙雕 WebStorm 检测不到以上三个属性，我只好直接用 @namespace 解决
 */

// 项目请求地址
const BASEURL = 'http://47.107.32.22:3000'
// 最大超时时间
const TIMEOUT = 5000
// 统一为GET
const METHOD = 'GET'

fly.config.baseURL = BASEURL
fly.config.timeout = TIMEOUT
fly.config.method = METHOD

const queue = {}

// request拦截器
fly.interceptors.request.use(config => {
  // 有请求,就把请求地址压入队列
  queue[config.url] = true
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  return config
}, error => {
  console.log('error⚠: ' + error)
  return Promise.reject(error)
})

// response拦截器
fly.interceptors.response.use(response => {
  console.log(response)
  delete queue[response.request.url]
  // 如果队列里的请求都为空，取消loading
  if (!Object.keys(queue).length) {
    wx.hideLoading()
  }
  return response
}, error => {
  /** @namespace error.request */
  delete queue[error.request.url]
  console.log('error⚠: ' + error)
  // 如果队列里的请求都为空,取消loading
  if (!Object.keys(queue).length) {
    wx.hideLoading()
  }
  return Promise.reject(error)
})

export default fly
