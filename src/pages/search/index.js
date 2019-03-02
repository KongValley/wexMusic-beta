import App from './search'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#C20C0C',
      navigationBarTitleText: '🔍搜索页',
      navigationBarTextStyle: 'white',
      usingComponents: {
        "i-modal": '../../static/iview/modal/index'
      }
    }
  }
}
