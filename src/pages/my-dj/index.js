import App from './my-dj'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#DF4337',
      navigationBarTitleText: '✌我的电台',
      navigationBarTextStyle: 'white',
      usingComponents: {
      }
    }
  }
}