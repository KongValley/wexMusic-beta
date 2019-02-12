// MARK 各类推荐接口
import fly from '@/utils/request'

/**
 * 获取每日推荐歌单,可获得每日推荐歌单(需要登录)
 */
export const getRecommendResourceAPI = () => fly.request({
  url: '/recommend/resource'
})

/**
 * 获取每日推荐歌曲,可获得每日推荐歌曲(需要登录)
 */
export const getRecommendSongsAPI = () => fly.request({
  url: '/recommend/songs'
})

/**
 * 获取推荐mv
 */
export const getPersonalizedMvAPI = () => fly.request({
  url: '/personalized/mv'
})

/**
 * 获取推荐歌单
 */
export const getPersonalizedPlaylistAPI = () => fly.request({
  url: '/personalized'
})

/**
 * 获取推荐新音乐
 */
export const getPersonalizedNewSongAPI = () => fly.request({
  url: '/personalized/newsong'
})

/**
 * 获取推荐电台
 */
export const getPersonalizedDjProgramAPI = () => fly.request({
  url: '/personalized/djprogram'
})

/**
 * 获取推荐节目
 */
export const getRecommendProgramAPI = () => fly.request({
  url: '/program/recommend'
})

// TBD 独家放送待定
/**
 * 获取独家放送
 */
export const getPersonalizedPrivatecontentAPI = () => fly.request({
  url: '/personalized/privatecontent'
})
