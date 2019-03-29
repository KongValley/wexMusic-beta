import App from './my-artist'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#DF4337',
      navigationBarTitleText: '✌收藏的歌手',
      navigationBarTextStyle: 'white',
      usingComponents: {
      }
    }
  }
}