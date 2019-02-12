// MARK 专辑/新碟接口
import fly from '@/utils/request'

/**
 * 获取云音乐首页新碟上架（最新专辑）数据
 * @param {Number} limit
 * @param {Number} offset
 */
export const getNewAlbumAPI = ({ limit = 50, offset = 0 }) => fly.request({
  url: '/top/album',
  body: {
    limit,
    offset
  }
})

/**
 * 获取专辑包含的具体音乐信息
 * @param {Number} id
 * @param {Number} limit
 * @param {Number} offset
 */
export const getAlbumSongsAPI = ({ id, limit = 50, offset = 0 }) => fly.request({
  url: '/album',
  body: {
    id,
    limit,
    offset
  }
})

/**
 * 获取专辑内容
 * 传入专辑 id, 可获得专辑内容
 *
 * @author Da Peng
 * @export
 * @param {Number} id // 专辑id
 * @returns
 */
export const getAlbumAPI = ({ id }) => fly.request({
  url: '/album',
  body: {
    id
  }
})
