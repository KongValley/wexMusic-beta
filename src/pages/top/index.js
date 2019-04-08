import App from './top'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#DF4337',
      navigationBarTitleText: '😘排行榜',
      navigationBarTextStyle: 'white',
      usingComponents: {
      }
    }
  }
}