import App from './signin'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#C20C0C',
      navigationBarTitleText: '📱手机号登录',
      navigationBarTextStyle: 'white',
      usingComponents: {
        "i-button": '../../static/iview/button/index',
        "i-input": '../../static/iview/input/index',
        "i-message": "../../static/iview/message/index"
      }
    }
  }
}