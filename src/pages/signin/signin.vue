<template>
  <div class="p-signin">
    <div class="p-signin-form">
      <div class="p-signin-input phone">
        <div class="p-signin-icon"><i class="material-icons">phone_android</i></div>
        <div class="p-signin-input-ex" :class="{'is-not-empty': phone}">+86</div>
        <input v-model="phone"
          type="number" placeholder="请输入手机号"
          placeholder-class="p-signin-place-holder"
          :class="{'is-not-empty': phone}"
          maxlength="11">
        <div class="p-signin-clear"><i class="material-icons" v-if="phone" @click="handleClear()">close</i></div>
      </div>
      <div class="p-signin-input password">
        <div class="p-signin-icon"><i class="material-icons">lock_outline</i></div>
        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          placeholder-class="p-signin-place-holder"
          :class="{'is-not-empty': password}">
      </div>
    </div>
    <div class="p-signin-button">
      <i-button i-class="button-primary" shape="circle" @click="handleSubmit">登录</i-button>
    </div>
    <i-message id="message"></i-message>
  </div>
</template>

<script>
import { loginByPhoneAPI } from '_a/login'

const { $Message } = require('_v/base/index')
export default {
  name: "p_signin",
  data() {
    return {
      phone: "",
      password: "",
      message: "",
    }
  },
  methods: {
    fetchSignIn() {
      const params = {
        phone: this.phone,
        password: this.password
      }
      return loginByPhoneAPI(params)
    },
    async handleSubmit() {
      try {
        const res = await this.fetchSignIn()
        console.log(res.data)
        $Message({
          content: "登录成功",
          type: 'success'
        })
        wx.setStorageSync('uid',res.data.account.id)
        wx.setStorageSync('wx-cookie',res.headers['set-cookie'][0])
        wx.reLaunch({
          url: '../home/index'
        })

      } catch (e) {
        $Message({
          content: "登录失败，请再试一次",
          type: 'error'
        })
        console.warn(e)
      }
    },
    handleClear() {
      if(this.phone)
        this.phone = ""
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~_s/common/var";
@font-face {
  font-family: 'Robot';
  font-style: normal;
  font-weight: 400;
  src: url(https://chara-static-source.oss-cn-shanghai.aliyuncs.com/font/Roboto-Regular.ttf) format('truetype');
}
.p-signin {
  &-form {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    color: rgba(0, 0, 0, .2);
  }
  &-icon {
    padding-right: 5px;
    color: rgba(0, 0, 0, .2);
  }
  &-clear {
    padding-right: 5px;
  }
  &-input {
    display: flex;
    height: 40px;
    margin: 0 15px;
    border-bottom: 2px solid rgba(0, 0, 0, .2);
    align-items: center;
    width: 100%;
    font-size: 18px;

    input {
      font-size: 14px;
      flex: 1;
      caret-color: $--color-primary;
      height: 100%;
    }

    &.phone {
      padding-top: 40px;
    }

    &.password {
      padding-top: 20px;
      input {
        font-size: 12px;
      }
    }

    .is-not-empty {
      color: #000;
    }
    &-ex {
      padding-right: 5px;
      font-size: 14px;
    }

    /deep/ .p-signin-place-holder {
      font-size: 14px;
      color: rgba(0, 0, 0, .2);
    }
  }
  &-button {
    padding-top: 20px;
    width: 100%;
    /deep/ .button-primary {
      color: #fff !important;
      background: linear-gradient(to right,#FE5949, $--color-primary) !important;
      box-shadow: none;
    }
  }
}


</style>