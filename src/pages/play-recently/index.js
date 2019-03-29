import App from './play-recently'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#DF4337',
      navigationBarTitleText: '🤟最近播放',
      navigationBarTextStyle: 'white',
      usingComponents: {
        "i-action-sheet": "../../static/iview/action-sheet/index",
        "i-toast": "../../static/iview/toast/index",
        "i-modal": "../../static/iview/modal/index"
      }
    }
  }
}