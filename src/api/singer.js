// MARK 歌手接口
import fly from '@/utils/request'

/**
 * 获取歌手分类列表
 * @param {Number} cat // 即 category Code,歌手类型,默认 1001,返回华语男歌手数据
 * @param {Number} limit
 * @param {Number} offset
 * @param {String} initial 按首字母索引查找参数
 * category Code 取值:
 * 入驻歌手 5001
 * 华语男歌手 1001
 * 华语女歌手 1002
 * 华语组合/乐队 1003
 * 欧美男歌手 2001
 * 欧美女歌手 2002
 * 欧美组合/乐队 2003
 * 日本男歌手 6001
 * 日本女歌手 6002
 * 日本组合/乐队 6003
 * 韩国男歌手 7001
 * 韩国女歌手 7002
 * 韩国组合/乐队 7003
 * 其他男歌手 4001
 * 其他女歌手 4002
 * 其他组合/乐队 4003
 */
export const getArtistListAPI = ({ cat = 1001, limit = 30, offset = 0, initial = 'a' }) => fly.request({
  url: '/artist/list',
  body: {
    cat,
    limit,
    offset,
    initial
  }
})

/**
 * 收藏/取消收藏歌手
 * @param {Number} id // 歌手id
 * @param {Number} t // 操作,1 为收藏,其他为取消收藏
 */
export const subArtistAPI = ({ id, t = 1 }) => fly.request({
  url: '/artist/sub',
  body: {
    id
  }
})

/**
 * 获取收藏的歌手列表
 */
export const getSubArtistListAPI = () => fly.request({
  url: '/artist/sublist'
})

/**
 * 获取歌手单曲
 *
 * @author Da Peng
 * @export
 * @param {Number} id // 歌手id,可由搜索接口获得
 * @returns
 */
export const getArtistSongAPI = ({ id }) => fly.request({
  url: '/artists',
  body: {
    id
  }
})

/**
 * 获取歌手mv
 * 传入歌手id,可获得歌手mv信息,具体mv播放地址可调用/mv传入此接口获得的 mvid 来拿到
 *
 * @author Da Peng
 * @export
 * @param {Number} id // 歌手 id
 * @returns
 */
export const getArtistMvAPI = ({ id }) => fly.request({
  url: '/artist/mv',
  body: {
    id
  }
})

/**
 * 获取歌手专辑
 * 传入歌手 id, 可获得歌手专辑内容
 *
 * @author Da Peng
 * @export
 * @param {Object} { id, limit = 50, offset = 0 } // 传入一个对象
 * @param {Number} id // 歌手 id
 * @param {Number} limit // 取出数量,默认为50
 * @param {Number} offset // 偏移数量,用于分页,如:(页数-1)*50,其中50为limit的值,默认为0
 * @returns
 */
export const getArtistAlbumAPI = ({ id, limit = 50, offset = 0 }) => fly.request({
  url: '/artist/album',
  body: {
    id,
    limit,
    offset
  }
})

/**
 * 获取歌手描述
 *
 * @author Da Peng
 * @export
 * @param {Number} id // 歌手 id
 * @returns
 */
export const getArtistDescAPI = ({ id }) => fly.request({
  url: '/artist/desc',
  body: {
    id
  }
})

