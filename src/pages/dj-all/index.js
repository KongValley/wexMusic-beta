import App from './dj-all'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#DF4337',
      navigationBarTitleText: '😘电台分类推荐',
      navigationBarTextStyle: 'white',
      usingComponents: {
        "i-action-sheet": "../../static/iview/action-sheet/index",
        "i-divider": "../../static/iview/divider/index",
        "i-load-more": "../../static/iview/load-more/index",
      }
    }
  }
}