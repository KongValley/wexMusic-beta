// MARK 排行榜接口
import fly from '@/utils/request'

/**
 * 获取所有榜单
 */
export const getAllToplistAPI = () => fly.request({
  url: '/toplist'
})

/**
 * 获取所有榜单内容摘要
 */
export const getAllToplistDetailAPI = () => fly.request({
  url: '/toplist/detail'
})

/**
 * 获取mv排行榜
 * @param {Number} limit
 * @param {Number} offset
 */
export const getTopMvAPI = ({ limit = 30, offset = 0 }) => fly.request({
  url: '/top/mv',
  body: {
    limit,
    offset
  }
})

/**
 * 传入数字 idx, 可获取不同排行榜
 * @param {Number} idx // idx: 对象 key, 对应以下排行榜:
 * "0": 云音乐新歌榜,
 * "1": 云音乐热歌榜,
 * "2": 网易原创歌曲榜,
 * "3": 云音乐飙升榜,
 * "4": 云音乐电音榜,
 * "5": UK排行榜周榜,
 * "6": 美国Billboard周榜
 * "7": KTV嗨榜,
 * "8": iTunes榜,
 * "9": Hit FM Top榜,
 * "10": 日本Oricon周榜
 * "11": 韩国Melon排行榜周榜,
 * "12": 韩国Mnet排行榜周榜,
 * "13": 韩国Melon原声周榜,
 * "14": 中国TOP排行榜(港台榜),
 * "15": 中国TOP排行榜(内地榜)
 * "16": 香港电台中文歌曲龙虎榜,
 * "17": 华语金曲榜,
 * "18": 中国嘻哈榜,
 * "19": 法国 NRJ EuroHot 30周榜,
 * "20": 台湾Hito排行榜,
 * "21": Beatport全球电子舞曲榜,
 * "22": 云音乐ACG音乐榜,
 * "23": 云音乐嘻哈榜
 */
export const getTopListAPI = ({ idx }) => fly.request({
  url: '/top/list',
  body: {
    idx
  }
})

/**
 * 获取歌手榜单
 */
export const getToplistArtistAPI = () => fly.request({
  url: '/toplist/artist'
})

