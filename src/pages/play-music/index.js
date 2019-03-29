import App from './play-music'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#333333',
      navigationBarTitleText: '😒正在播放',
      navigationBarTextStyle: 'white',
      usingComponents: {
        "i-action-sheet": "../../static/iview/action-sheet/index",
        "i-toast": "../../static/iview/toast/index",
        "i-modal": "../../static/iview/modal/index"
      }
    }
  }
}
