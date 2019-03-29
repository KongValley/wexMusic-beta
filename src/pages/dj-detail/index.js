import App from './dj-detail'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#333333',
      navigationBarTitleText: '😑电台详情',
      navigationBarTextStyle: 'white',
      "usingComponents": {
        "i-divider": "../../static/iview/divider/index",
        "i-load-more": "../../static/iview/load-more/index",
        "i-toast": "../../static/iview/toast/index",
        "i-modal": "../../static/iview/modal/index"
      }
    }
  }
}
