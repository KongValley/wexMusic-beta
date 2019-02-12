// MARK 歌曲接口
import fly from '@/utils/request'

/**
 * 获取新歌速递
 * @param {Number} type 地区类型 id,对应以下:全部-0;华语-7;
 * 欧美-96;日本-8;韩国-16
 */
export const getTopSongAPI = ({ type }) => fly.request({
  url: '/top/song',
  data: {
    type
  }
})

/**
 * 获取音乐url
 *
 * @author Da Peng
 * @export
 * @param {Object} {id,br = 999000} // 传入一个对象
 * @param {Number} id // 音乐id
 * @param {Number} br // 码率,默认设置了999000 即最大码率,如果要320k则可设置为320000,其他类推
 * @returns
 */
export const getMusicUrlAPI = ({ id, br = 999000 }) => fly.request({
  url: '/music/url',
  body: {
    id,
    br
  }
})

/**
 * 检查音乐是否可用
 *
 * @author Da Peng
 * @export
 * @param {Number} id // 音乐id
 * @returns
 */
export const checkMusicAPI = ({ id }) => fly.request({
  url: '/check/music',
  body: {
    id
  }
})

/**
 * 获取歌词,传入音乐id可获得对应音乐的歌词(不需要登录)
 *
 * @author Da Peng
 * @export
 * @param {Number} id // 音乐id
 * @returns
 */
export const getMusicLyricAPI = ({ id }) => fly.request({
  url: '/lyric',
  body: {
    id
  }
})

/**
 * 获取歌曲详情
 * 传入音乐id(支持多个 id, 用 , 隔开)
 * 可获得歌曲详情(注意:歌曲封面需要通过专辑内容接口获取)
 *
 * @author Da Peng
 * @param {Stirng} ids // 音乐id
 * @export
 */
export const getSongDetailAPI = ({ ids }) => fly.request({
  url: '/song/detail',
  body: {
    ids
  }
})

