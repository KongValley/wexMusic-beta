import App from './my-follows'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#DF4337',
      navigationBarTitleText: '✌我的关注',
      navigationBarTextStyle: 'white',
      usingComponents: {
        "i-action-sheet": "../../static/iview/action-sheet/index",
        "i-toast": "../../static/iview/toast/index",
        "i-modal": "../../static/iview/modal/index",
        "i-input": "../../static/iview/input/index"
      }
    }
  }
}