import App from './my-music'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#DF4337',
      navigationBarTitleText: '😜我的音乐',
      navigationBarTextStyle: 'white',
      usingComponents: {
        "i-action-sheet": "../../static/iview/action-sheet/index",
        "i-toast": "../../static/iview/toast/index",
        "i-collapse": "../../static/iview/collapse/index",
        "i-collapse-item": "../../static/iview/collapse-item/index"
      }
    }
  }
}