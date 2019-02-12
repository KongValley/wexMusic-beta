// MARK 歌单接口
import fly from '@/utils/request'

/**
 * 歌单分类,包含 category 信息
 *
 * @author Da Peng
 * @export
 * @returns
 */
export const getCatlistAPI = () => fly.request({
  url: '/playlist/catlist'
})

/**
 * 热门歌单分类,包含 category 信息
 *
 * @author Da Peng
 * @export
 * @returns
 */
export const getPlaylistHotAPI = () => fly.request({
  url: '/playlist/hot'
})

/**
 * 歌单 ( 网友精选碟 )
 *
 * @author Da Peng
 * @export
 * @param {Object} { order = 'hot', tag = '全部', limit = 10 }
 * @param {String} order // 可选值为'new'和'hot',分别对应最新和最热,默认为'hot'
 * @param {String} tag // 比如"华语"、"古风"、"欧美"、"流行",默认为"全部",可从歌单分类接口获取(/playlist/catlist)
 * @param {Number} limit
 * @returns
 */
export const getPlaylistTopAPI = ({ order = 'hot', tag = '全部', limit = 20 }) => fly.request({
  url: '/top/playlist',
  body: {
    order,
    tag,
    limit
  }
})

/**
 * 获取精品歌单
 *
 * @author Da Peng
 * @export
 * @param {Object} { tag = '全部', limit = 10 }
 * @param {String} tag // 比如"华语"、"古风"、"欧美"、"流行",默认为"全部",可从歌单分类接口获取(/playlist/catlist)
 * @param {Number} limit
 * @returns
 */
export const getPlaylistHighqualityAPI = ({ tag = '全部', limit = 20 }) => fly.request({
  url: '/top/playlist/highquality',
  body: {
    tag,
    limit
  }
})

/**
 * 相关歌单推荐
 *
 * @author Da Peng
 * @export
 * @param {Number} id
 * @returns
 */
export const getPlaylistRelatedAPI = ({ id }) => fly.request({
  url: '/related/playlist',
  body: {
    id
  }
})

/**
 * 获取歌单详情
 *
 * @author Da Peng
 * @export
 * @param {Object} { id, s = 3 }
 * @param {Number} id
 * @param {Number} s //歌单最近的s个收藏者,设置默认值为3
 * @returns
 */
export const getPlaylistDetailAPI = ({ id, s = 3 }) => fly.request({
  url: '/playlist/detail',
  body: {
    id,
    s
  }
})

/**
 * 新建歌单接口
 *
 * @author Da Peng
 * @export
 * @param {String} name
 * @returns
 */
export const getPlaylistCreateAPI = ({ name }) => fly.request({
  url: '/playlist/create',
  body: {
    name
  }
})

/**
 * 收藏/取消收藏歌单
 *
 * @author Da Peng
 * @export
 * @param {Object} { id, t }
 * @param {Number} id
 * @param {Number} t // 类型,1:收藏,2:取消收藏
 * @returns
 */
export const getPlaylistSubScribeAPI = ({ id, t }) => fly.request({
  url: '/playlist/subscribe',
  body: {
    id,
    t
  }
})

/**
 * 对歌单添加或删除歌曲
 *
 * @author Da Peng
 * @export
 * @param {Object} { op, pid, tracks }
 * @param {String} op // 从歌单增加单曲为 add, 删除为 del
 * @param {Number} pid
 * @param {String} tracks // 歌曲 id,可多个,用逗号隔开
 * @returns
 */
export const getPlaylistTracksAPI = ({ op, pid, tracks }) => fly.request({
  url: '/playlist/tracks',
  body: {
    op,
    pid,
    tracks
  }
})

