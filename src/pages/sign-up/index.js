import App from './sign-up'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#DF4337',
      navigationBarTitleText: '📱手机号注册',
      navigationBarTextStyle: 'white',
      usingComponents: {
        "i-button": '../../static/iview/button/index',
        "i-input": '../../static/iview/input/index',
        "i-message": "../../static/iview/message/index"
      }
    }
  }
}