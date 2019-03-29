import Fly from 'flyio/dist/npm/wx'
const fly = new Fly()

// 项目api部署地址
// const BASEURL = 'http://47.107.32.22:3000'
const BASEURL = 'http://47.107.32.22:4000/'
// 最大超时时间
const TIMEOUT = 5000
// 统一为GET
const METHOD = 'GET'

fly.config.baseURL = BASEURL
fly.config.timeout = TIMEOUT
fly.config.method = METHOD

// TBD 取消请求发送时的loading图，真的丑
// const queue = {}

// request拦截器
fly.interceptors.request.use(config => {
  // 有请求,就把请求地址压入队列
  // queue[config.url] = true
  // wx.showLoading({
  //   title: '电磁波发送中',
  //   mask: true
  // })
  if(wx.getStorageSync('wx-cookie')){
    config.headers['wx-cookie'] = wx.getStorageSync('wx-cookie')
  }
  return config
}, error => {
  console.warn('发生错误😭 ')
  console.warn(error)
  return Promise.reject(error)
})

// response拦截器
fly.interceptors.response.use(response => {
  console.log(response)
  // delete queue[response.request.url]
  // // 如果队列里的请求都为空，取消loading
  // if (!Object.keys(queue).length) {
  //   wx.hideLoading()
  // }
  return response
}, error => {
  // delete queue[error.request.url]
  // // 如果队列里的请求都为空,取消loading
  // if (!Object.keys(queue).length) {
  //   wx.hideLoading()
  // }
  console.warn('发生错误😭 ')
  console.warn(error)
  return Promise.reject(error)
})

export default fly
