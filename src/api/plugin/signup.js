// MARK 注册接口
import fly from '@/utils/request'
const URL = 'http://127.0.0.1:2333'
export const getUserMessageCodeAPI = ({ username, password }) => fly.request('/login',{
    username,
    password
  },
  {
    method: 'POST',
    baseURL: URL,
    timeout: '10000'
  }
)

export const sendMessageCodeAPI = ({ username, msgCode }) => fly.request('/getMsgCode',{
    username,
    msgCode
  },
  {
    method: 'POST',
    baseURL: URL,
    timeout: '10000'
  }
)