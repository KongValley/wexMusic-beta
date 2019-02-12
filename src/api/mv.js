// MARK MV接口
import fly from '@/utils/request'

/**
 * 获取最新 mv
 * @param {Number} limit
 */
export function getNewMvAPI({ limit = 30 }) {
  return fly.request({
    url: '/mv/first',
    body: {
      limit
    }
  })
}
