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
export const getBanner = () => fly.request({
  url: '/banner'
})
