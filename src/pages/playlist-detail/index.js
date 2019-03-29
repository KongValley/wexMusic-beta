import App from './playlist-detail'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#333333',
      navigationBarTitleText: '🤙歌单详情',
      navigationBarTextStyle: 'white',
      "usingComponents": {
        "i-action-sheet": "../../static/iview/action-sheet/index",
        "i-divider": "../../static/iview/divider/index",
        "i-load-more": "../../static/iview/load-more/index",
        "i-toast": "../../static/iview/toast/index",
        "i-modal": "../../static/iview/modal/index"
      }
    }
  }
}