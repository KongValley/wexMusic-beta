<template>
  <div class="p-ad">
    <div class="p-ad-title">
      iMusic
    </div>
    <div class="p-ad-button-group">
      <i-button type="ghost" shape="circle" i-class="p-ad-button" @click="handleToSignIn">手机号登录</i-button>
      <i-button type="ghost" shape="circle" i-class="p-ad-button" @click="handleToSignUp">注册</i-button>
    </div>
  </div>
</template>

<script>
import { loginByPhoneAPI,getLoginStatusAPI } from '_a/login'
import CButton from '_c/button'
const { $Message } = require('_v/base/index')
export default {
  name: 'p_ad',
  components: {
    CButton
  },
  data() {
    return {
      phone: '',
      password: ''
    }
  },
  methods: {
    handleToSignIn() {
      wx.navigateTo({
        url: '../signin/index'
      })
    },
    handleToSignUp() {
      wx.navigateTo({
        url: '../sign-up/index'
      })
    },
    async isLogin() {
      if(!wx.getStorageSync('wx-cookie').length) {
        return
      }
      try {
        const res = await getLoginStatusAPI()
        if(res.data.code === 200) {
          wx.reLaunch({
            url: '../home/index'
          })
        }
      } catch (e) {
        console.log('暂无账号信息')
      }
    }
  },
  async mounted() {
    await this.isLogin()
    wx.setStorageSync('playStatus', false)
  }
}
</script>

<style lang="scss" scoped>
@import "~_s/common/var";
.p-ad {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .p-ad-title {
    display:inline-block;
    font-size: 35px;
    color: $--color-primary;
    border-top: 3px solid $--color-primary;
    border-bottom: 3px solid $--color-primary;
    width: 150px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    letter-spacing: 3px;
    margin-bottom: 150px;
  }
  .p-ad-button-group {

    /deep/ .p-ad-button {
      color: $--color-primary !important;
      box-shadow: inset 0 0 0 2px $--color-primary;
    }

    position: absolute;
    box-sizing: border-box;
    bottom: 0;
    left: 0;
    display: flex;
    width: 100%;
    flex-direction: column;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 30px;
  }
  
}
</style>
