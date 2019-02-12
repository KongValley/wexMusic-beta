// MARK DJ接口
import fly from '@/utils/request'
// TBD 有时间再开发这部分
export const getDjRecommendAPI = () => fly.request({
  url: '/dj/recommend'
})

export const getDjCatelistAPI = () => fly.request({
  url: '/dj/catelist'
})

export const getDjRecommendTypeAPI = ({ type }) => fly.request({
  url: '/dj/recommend/type',
  body: {
    type
  }
})

export const getSubDjAPI = (rid, t) => fly.request({
  url: '/dj/sub',
  body: {
    rid,
    t
  }
})

export const getDjPaygiftAPI = ({ limit = 20, offset = 0 }) => fly.request({
  url: '/dj/paygift',
  body: {
    limit,
    offset
  }
})

export const getDjDetailAPI = (rid) => fly.request({
  url: '/dj/detail',
  body: {
    rid
  }
})

export const getDjProgramAPI = ({ rid, limit = 30, offset = 0 }) => fly.request({
  url: '/dj/program',
  body: {
    rid,
    limit,
    offset
  }
})

