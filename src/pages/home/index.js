import App from './home'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
  _wechat: {
    navigationBarBackgroundColor: '#C20C0C',
    navigationBarTitleText: '😀首页',
    navigationBarTextStyle: 'white',
    usingComponents: {
        "i-button": '../../static/iview/button/index',
        "i-input": '../../static/iview/input/index',
        "i-tabs": "../../static/iview/tabs/index",
        "i-tab": "../../static/iview/tab/index"
      }
    }
  }
}