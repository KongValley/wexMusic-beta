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
 * 获取用户信息 , 歌单，收藏，mv, dj 数量
 *
 * @author Da Peng
 * @export
 * @returns
 */
export const getUserSubcountAPI = () => fly.request({
  url: '/user/subcount'
})


/**
 * 获取用户歌单,传入用户id,可以获取用户歌单
 *
 * @author Da Peng
 * @export
 * @param {String} uid // 用户 id
 * @returns
 */
export const getUserPlaylistAPI = ({ uid }) => fly.request({
  url: '/user/playlist',
  body: {
    uid
  }
})

/**
 * 更新歌单信息
 *
 * @author Da Peng
 * @export
 * @param {Object} { id, name, desc, tags } // 传入一个对象
 * @param {String} id // 歌单id
 * @param {String} name // 歌单名字
 * @param {String} desc // 歌单描述
 * @param {String} tags // 歌单tag
 * @returns
 */
export const updateUserPlaylistInfoAPI = ({ id, name, desc, tags }) => fly.request({
    url: '/playlist/update',
    body: {
      id,
      name,
      desc,
      tags
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
 * 发送私信(带歌单)
 * 传入用户 id 和要发送的信息和歌单 id
 * 可以发送带歌单的私信(注:不能发送重复的歌单)
 *
 * @author Da Peng
 * @export
 * @param {Object} { user_ids, msg, playlist } // 传入一个对象
 * @param {String} user_ids 用户 id,多个需用逗号隔开
 * @param {String} msg // 要发送的信息
 * @param {Number} playlist // 歌单 id
 * @returns
 */
export const sendMessageAndPlaylistAPI = ({ user_ids, msg, playlist }) => fly.request({
  url: '/send/playlist',
  body: {
    user_ids,
    msg,
    playlist
  }
})

/**
 * 获取用户电台,传入用户id,可以获取用户电台
 *
 * @author Da Peng
 * @export
 * @param {String} uid // 用户 id
 * @returns
 */
export const getUserDjAPI = ({ uid }) => fly.request({
  url: '/user/dj',
  body: {
    uid
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
 * 私人FM(需要登录)
 *
 * @author Da Peng
 * @export
 * @returns
 */
export const getPersonalFmAPI = () => fly.request({
  url: '/personal_fm'
})

/**
 * 签到,传入签到类型 ( 可不传 , 默认安卓端签到 ), 可签到 ( 需要登录 )
 * 其中安卓端签到可获得 3 点经验 , web/PC 端签到可获得 2 点经验
 *
 * @author Da Peng
 * @export
 * @param {String} type // 签到类型 , 默认 0, 其中 0 为安卓端签到 ,1 为 web/PC 签到
 * @returns
 */
export const dailySigninAPI = ({ type = 0 }) => fly.request({
  url: '/daily_signin',
  body: {
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

export const getlikeMusicListAPI = ({ uid }) => fly.request({
  url: '/likelist',
  body: {
    uid
  }
})

/**
 * 垃圾桶,传入音乐 id,可把该音乐从私人 FM 中移除至垃圾桶
 *
 * @param {Number} id
 */
export const fmTranshAPI = ({ id }) => fly.request({
  url: '/fm_trash',
  body: {
    id
  }
})
