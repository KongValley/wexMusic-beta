<template>
  <div class="p-ad">
    <div class="p-ad__title">
      iMusic
    </div>
    <div class="p-ad__button--group">
      
    </div>
  </div>
</template>

<script>
import { loginByPhoneAPI,getLoginStatusAPI } from '_a/login'
import CButton from '_c/button'
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
      console.log('click')
      wx.navigateTo({
        url: '../signin/index'
      })
    },
    async autoLogin() {
      try {
        const phone = wx.getStorageSync('phone')
        const password = wx.getStorageSync('password')
        if(phone.length && password.length) {
          let params =  {
            phone: phone,
            password: password
          }
          // const res = await loginByPhoneAPI({
          //   ...params
          // })
          // if(res.code === '200') {
              //TODO 跳转到首页
          // }
        }
        const res = await getLoginStatusAPI()
      } catch (e) {
        console.log('暂无账号信息')
      }
    }
  },
  async mounted() {
    await this.autoLogin()
  }
}
</script>

<style lang="scss" scoped>
@import "~_s/common/var";
@import "~_s/mixins/mixin";
@include b(ad,p) {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @include e(title) {
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
  @include e(button) {
    text-transform: uppercase;
    font-size: 20px;
    @include m(group) {
      position: absolute;
      box-sizing: border-box;
      bottom: 0;
      left: 0;
      display: flex;
      width: 100%;
      justify-content: space-around;
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 30px;
    }
  }
}
</style>
