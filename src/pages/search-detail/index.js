import App from './search-detail'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    _wechat: {
      navigationBarBackgroundColor: '#DF4337',
      navigationBarTitleText: '😑搜索结果',
      navigationBarTextStyle: 'white',
    }
  }
}