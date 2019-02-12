// MARK MV或者视频播放接口
import fly from '@/utils/request'
/**
 * 获取mv播放地址
 * @param {String} id // mv的id
 */
export const getMvUrlAPI = ({ id }) => fly.request({
  url: '/mv/url',
  body: {
    id
  }
})

/**
 * 获取视频播放地址
 * @param {String} id // 视频的id
 */
export const getVideoUrlAPI = ({ id }) => fly.request({
  url: '/video/url',
  body: {
    id
  }
})

// export const playMvOrVideoAPI = (url) => fly.request({
//   url: '/mv/url',
//   body: {
//     url
//   }
// })
