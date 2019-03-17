import App from './album-detail'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#333333',
      navigationBarTitleText: '🎹专辑详情',
      navigationBarTextStyle: 'white',
      "usingComponents": {
        "i-tabs": "../../static/vant/tabs/index",
        "i-tab": "../../static/vant/tab/index",
        "i-action-sheet": "../../static/iview/action-sheet/index",
        "i-divider": "../../static/iview/divider/index",
        "i-load-more": "../../static/iview/load-more/index",
        "i-toast": "../../static/iview/toast/index"
      }
    }
  }
}
