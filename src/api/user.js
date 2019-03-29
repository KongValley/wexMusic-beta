// MARK 用户相关接口
import fly from '@/utils/request'

/**
 * 获取用户详情
 *
 * @author Da Peng
 * @export
 * @param {String} uid // 用户id
 * @returns
 */
export const getUserDetailAPI = ({ uid }) => fly.request({
  url: '/user/detail',
  body: {
    uid
  }
})

/**
 * 获取获取收藏的歌手列表
 *
 * @author Da Peng
 * @export
 * @returns
 */
export const getUserSubArtistAPI = () => fly.request({
  url: '/artist/sublist'
})


/**
 * 获取用户歌单,传入用户id,可以获取用户歌单
 *
 * @author Da Peng
 * @export
 * @param {String} uid // 用户 id
 * @param args
 * @returns
 */
export const getUserPlaylistAPI = ({ uid,...args }) => fly.request({
  url: '/user/playlist',
  body: {
    uid,
    ...args
  }
})

/**
 * 发送私信
 * 传入用户id和要发送的信息,可以发送私信
 * 返回内容为历史私信,包含带歌单的私信信息
 * (注:不能发送私信给自己)
 *
 * @author Da Peng
 * @export
 * @param {*} { user_ids, msg }
 * @param {String} user_ids 用户 id,多个需用逗号隔开
 * @param {String} msg // 要发送的信息
 * @returns
 */
export const sendMessageAPI = ({ user_ids, msg }) => fly.request({
  url: '/send/text',
  body: {
    user_ids,
    msg
  }
})


/**
 * 获取用户关注列表
 * 传入用户 id, 可以获取用户关注列表
 *
 * @author Da Peng
 * @export
 * @param {Object} { uid, limit = 30, offset = 0 } // 传入一个对象
 * @param {String} uid // 用户 id
 * @param {Number} limit // 返回数量,默认为 30
 * @param {Number} offset // 偏移数量,用于分页,如:(页数-1)*30,其中30为limit的值,默认为 0
 * @returns
 */
export const getUserFollowsAPI = ({ uid, limit = 30, offset = 0 }) => fly.request({
  url: '/user/follows',
  body: {
    uid,
    limit,
    offset
  }
})

/**
 * 获取用户播放记录
 *
 * @author Da Peng
 * @export
 * @param {String} uid // 用户 id
 * @param {Number} type // type=1 时只返回 weekData, type=0 时返回 allData
 * @returns
 */
export const getUserRecordAPI = ({ uid, type = 1 }) => fly.request({
  url: '/user/record',
  body: {
    uid,
    type
  }
})

/**
 * 喜欢音乐
 *
 * @param {String} id
 * @param {Boolean} like
 */
export const likeMusicAPI = ({ id, like = true }) => fly.request({
  url: '/like',
  body: {
    id,
    like
  }
})

export const getLikeMusicListAPI = ({ uid }) => fly.request({
  url: '/likelist',
  body: {
    uid
  }
})

