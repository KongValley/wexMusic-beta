// MARK comment接口
import fly from '@/utils/request'

/**
 * 歌曲评论,传入音乐id和limit参数,可获得该音乐的所有评论(不需要登录)
 *
 * @author Da Peng
 * @export
 * @param {Object} { id, limit = 20, offset = 0 } // 传入一个对象
 * @param {String} id // 音乐 id
 * @param {Number} limit // 取出评论数量,默认为20
 * @param {Number} offset // 偏移数量,用于分页,如:(评论页数-1)*20,其中20为limit的值
 * @returns
 */
export const getMusicCommentsAPI = ({ id, limit = 20, offset = 0, ...args }) => fly.request({
  url: '/comment/music',
  body: {
    id,
    limit,
    offset,
    ...args
  }
})

/**
 * 专辑评论,传入音乐id和limit参数,可获得该专辑的所有评论(不需要登录)
 *
 * @author Da Peng
 * @export
 * @param {Object} { id, limit = 20, offset = 0 } // 传入一个对象
 * @param {String} id // 专辑 id
 * @param {Number} limit // 取出评论数量 , 默认为 20
 * @param {Number} offset // 偏移数量,用于分页,如:( 评论页数 -1)*20, 其中20为limit的值
 * @returns
 */
export const getAlbumCommentsAPI = ({ id, limit = 20, offset = 0, ...args }) => fly.request({
  url: '/comment/album',
  body: {
    id,
    limit,
    offset,
    ...args
  }
})

/**
 * 歌单评论,传入音乐id和limit参数,可获得该歌单的所有评论(不需要登录)
 *
 * @author Da Peng
 * @export
 * @param {Object} { id, limit = 20, offset = 0 } // 传入一个对象
 * @param {String} id // 歌单 id
 * @param {Number} limit // 取出评论数量 , 默认为 20
 * @param {Number} offset // 偏移数量,用于分页,如:( 评论页数 -1)*20, 其中20为limit的值
 * @returns
 */
export const getPlaylistCommentsAPI = ({ id, limit = 20, offset = 0, ...args }) => fly.request({
  url: '/comment/playlist',
  body: {
    id,
    limit,
    offset,
    ...args
  }
})


/**
 * 电台节目评论,传入音乐id和limit参数,可获得该电台节目的所有评论(不需要登录)
 *
 * @author Da Peng
 * @export
 * @param {Object} { id, limit = 20, offset = 0 } // 传入一个对象
 * @param {Number} id // 电台 id
 * @param {Number} limit // 取出评论数量 , 默认为 20
 * @param {Number} offset // 偏移数量,用于分页,如:( 评论页数 -1)*20, 其中20为limit的值
 * @returns
 * @returns
 */
export const getDjCommentsAPI = ({ id, limit = 20, offset = 0 }) => fly.request({
  url: '/comment/dj',
  body: {
    id,
    limit,
    offset
  }
})

/**
 * 给评论点赞,传入 type, 资源 id, 和评论 cid 和 是否点赞参数 t 即可给对 应评论点赞 ( 需要登录 )
 *
 * @author Da Peng
 * @export
 * @param {Object} { id, cid, t, type } // 传入一个对象
 * @param {String} id // 资源 id, 如歌曲 id,mv id
 * @param {Number} cid // 评论 id
 * @param {Number} t // 是否点赞 ,1 为点赞 ,0 为取消点赞
 * @param {Number} type // 数字,资源类型,对应歌曲 0 , 歌单 2 , 专辑 3 , 电台 4
 * @returns
 */
export const likeCommentAPI = ({ id, cid, t, type, ...args }) => fly.request({
  url: '/comment/like',
  body: {
    id,
    cid,
    t,
    type,
    ...args
  }
})

/**
 * 发送评论
 *
 * @author Da Peng
 * @export
 * @param {Object} { action, type, id, content } // 传入一个对象
 * @param {Number} t // 1 发送,0 删除
 * @param {Number} type // 数字,资源类型,对应歌曲 0 , mv 1 , 歌单 2 , 专辑 3 , 电台 4, 视频 5
 * @param {String} id // 对应资源id
 * @param {String} content // 要发送的内容
 */
export const sendCommentsAPI = ({ t = 1, type, id, content }) => fly.request({
  url: '/comment',
  body: {
    t,
    type,
    id,
    content
  }
})

/**
 * 删除评论
 *
 * @author Da Peng
 * @export
 * @param {Object} { action, type, id, content } // 传入一个对象
 * @param {Number} t // 1 发送,0 删除
 * @param {Number} type // 数字,资源类型,对应歌曲 0 , mv 1 , 歌单 2 , 专辑 3 , 电台 4, 视频 5
 * @param {String} id // 对应资源 id
 * @param {String} commentId // 评论 id
 */
export const deleteCommentsAPI = ({ t = 0, type, id, commentId }) => fly.request({
  url: '/comment',
  body: {
    t,
    type,
    id,
    commentId
  }
})

