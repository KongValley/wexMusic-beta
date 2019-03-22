import App from './comment'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#DF4337',
      navigationBarTitleText: '💬评论页',
      navigationBarTextStyle: 'white',
      usingComponents: {
        "i-action-sheet": "../../static/iview/action-sheet/index",
        "i-toast": "../../static/iview/toast/index"
      }
    }
  }
}