// MARK 相似推荐接口
import fly from '@/utils/request'
/**
 * 获取相似歌手,传入歌手 id, 可获得相似歌手
 *
 * @author Da Peng
 * @export
 * @param {Number} id // 歌手 id
 * @returns
 */
export const getSimiArtistAPI = ({ id }) => fly.request({
  url: '/simi/artist',
  body: {
    id
  }
})

/**
 * 获取相似歌单,传入歌曲 id, 可获得相似歌单
 *
 * @author Da Peng
 * @export
 * @param {Number} id // 歌曲 id
 * @returns
 */
export const getSimiPlaylistAPI = ({ id }) => fly.request({
  url: '/simi/palylist',
  body: {
    id
  }
})

/**
 * 相似 mv,传入 mv id 可获取相似 mv
 *
 * @author Da Peng
 * @export
 * @param {Number} mvid // mv id
 * @returns
 */
export const getSimiMvAPI = ({ mvid }) => fly.request({
  url: '/simi/mv',
  body: {
    mvid
  }
})

/**
 * 获取相似音乐,传入歌曲 id, 可获得相似歌曲
 *
 * @author Da Peng
 * @export
 * @param {Number} id // 歌曲 id
 * @returns
 */
export const getSimiSongAPI = ({ id }) => fly.request({
  url: '/simi/song',
  body: {
    id
  }
})

/**
 * 获取最近 5 个听了这首歌的用户,传入歌曲 id, 获取最近 5 个听了这首歌的用户
 *
 * @author Da Peng
 * @export
 * @param {Number} id // 歌曲 id
 * @returns
 */
export const getSimiUserAPI = ({ id }) => fly.request({
  url: '/simi/user',
  body: {
    id
  }
})

