import App from './App'
import Vue from 'vue'
import '_s/index.scss'
import VHtmlPlugin from '@megalo/vhtml-plugin'

// 引入Fundebug，进行线上监控前端异常
// const fundebug = require('./utils/fundebug.1.0.0.min')
// fundebug.init({
//   apikey: '850d3afe3ffe3207903b5d7b44b1329fc30cd31238e628934f3aeb3c212aaede'
// })

Vue.use(VHtmlPlugin)

const app = new Vue(App)

app.$mount()

export default {
  config: {
    // pages 的首个页面会被编译成首页
    pages: [
      'pages/my-music/index',
      'pages/dj-detail/index',
      'pages/my-dj/index',
      'pages/my-artist/index',
      'pages/my-follows/index',
      // 'pages/my-music/index',
      'pages/play-recently/index',
      'pages/playlist-detail/index',
      'pages/comment/index',
      'pages/search-detail/index',
      'pages/play-music/index',
      'pages/album-detail/index',
      'pages/artist-detail/index',
      'pages/search/index',
      'pages/home/index',
      'pages/ad/index',
      'pages/signin/index',
      // 'pages/search-detail/index'
    ],
    "requiredBackgroundModes": ["audio"],
    // tabBar: {
    //   color: '#333',
    //   selectedColor: '#007d37',
    //   list: [
    //     {
    //       pagePath: 'pages/search-detail/index',
    //       text: 'Home',
    //       iconPath: 'static/imgs/home.png',
    //       selectedIconPath: 'static/imgs/home_on.png'
    //     },
    //     {
    //       pagePath: 'pages/ad/index',
    //       text: 'my',
    //       iconPath: 'static/imgs/mine.png',
    //       selectedIconPath: 'static/imgs/mine_on.png',
    //       }
    //   ]
      // list: [
      //   {
      //   pagePath: 'pages/hello',
      //   text: 'home',
      //   iconPath: 'static/imgs/home.png',
      //   selectedIconPath: 'static/imgs/home_on.png',
      //   },
      //   {
      //   pagePath: 'pages/my/index',
      //   text: 'my',
      //   iconPath: 'static/imgs/mine.png',
      //   selectedIconPath: 'static/imgs/mine_on.png',
      //   }
      // ]
    // },
    window: {
      navigationBarBackgroundColor: '#DF4337',
      navigationBarTitleText: '网不易云音乐',
      navigationBarTextStyle: 'white'
    }
  }
}