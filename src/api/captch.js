// MARK banner接口
import fly from '@/utils/request'

/**
 * 获取轮播图
 * 因参数未知,只能获取比较旧的数据
 *
 * @author Da Peng
 * @export
 * @returns
 */
export const sendCaptchAPI = ({cellphone, password}) => fly.request({
  url: '/captch/sent',
  body: {
    cellphone,
    password
  }
})

export const verifyCaptchAPI = ({cellphone, captcha}) => fly.request({
  url: '/captch/verify',
  body: {
    cellphone,
    captcha
  }
})

export const registerCaptchAPI = ({phone, captcha, password, nickname}) => fly.request({
  url: '/captch/register',
  body: {
    phone,
    captcha,
    password,
    nickname
  }
})
