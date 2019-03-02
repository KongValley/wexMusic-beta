import App from './music'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#C20C0C',
      navigationBarTitleText: '🤣我的音乐',
      navigationBarTextStyle: 'white',
      usingComponents: {
        "i-button": '../../static/iview/button/index'
      }
    }
  }
}