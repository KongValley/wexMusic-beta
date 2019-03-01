import App from './ad'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#C20C0C',
      navigationBarTitleText: '🚀广告页',
      navigationBarTextStyle: 'white',
      usingComponents: {
        "i-button": '../../static/iview/button/index'
      }
    }
  }
}
