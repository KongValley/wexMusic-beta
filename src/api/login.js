// MARK 登录接口
import fly from '@/utils/request'

/**
 * 邮箱登陆
 *
 * @author Da Peng
 * @export
 * @param {String} email
 * @param {String} password
 * @returns
 */
export const loginByEmailAPI = ({ email, password }) => fly.request({
  url: '/login',
  body: {
    email,
    password
  }
})

/**
 * 手机登陆
 *
 * @author Da Peng
 * @export
 * @param {String} phone
 * @param {String} password
 * @returns
 */
export const loginByPhoneAPI = ({ phone, password }) => fly.request({
  url: '/login/cellphone',
  body: {
    phone,
    password
  }
})

/**
 * 刷新登陆状态
 *
 * @author Da Peng
 * @export
 * @returns
 */
export const loginRefreshAPI = () => fly.request({
  url: '/login/refresh'
})

/**
 * 获取登陆状态
 *
 * @author Da Peng
 * @export
 * @returns
 */
export const getloginStatusAPI = () => fly.request({
  url: '/login/status'
})

/**
 * 账号退出登录
 *
 * @author Da Peng
 * @export
 * @returns
 */
export const logOutAPI = () => fly.request({
  url: '/logout'
})

