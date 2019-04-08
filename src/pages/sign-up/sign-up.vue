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
      <div class="p-signin-input password">
        <div class="p-signin-icon"><i class="material-icons">lock_outline</i></div>
        <input
          v-model="code"
          type="number"
          placeholder="请输入验证码"
          placeholder-class="p-signin-place-holder"
          :class="{'is-not-empty': code}">
      </div>
    </div>
    <div class="p-signin-button">
      <i-button i-class="button-primary" shape="circle" @click="handleSignUp">登录</i-button>
    </div>
    <i-message id="message"></i-message>
  </div>
</template>

<script>
  // import { loginByPhoneAPI } from '_a/login'
  import { getUserMessageCodeAPI,sendMessageCodeAPI } from '_a/plugin/signup'
  const { $Message } = require('_v/base/index')
  export default {
    name: "p_signin",
    data() {
      return {
        phone: "",
        password: "",
        message: "",
        code: '',
        isFirst: true
      }
    },
    methods: {
      async handleSignUp() {
        try {
          if(this.isFirst) {
            const params = {
              username: this.phone,
              password: this.password
            }
            const res = await getUserMessageCodeAPI(params)
            console.log(res.data)
            if(res.data.code === 200) {
              $Message({
                content: "发送验证码成功，请查收",
                type: 'success'
              })
              this.isFirst = false
            }
          } else {
            const params = {
              username: this.phone,
              msgCode: this.code
            }
            const res = await sendMessageCodeAPI(params)
            if(res.data.code === 200) {
              $Message({
                content: "注册成功",
                type: 'success'
              })
              wx.redirectTo({
                url: '../home/index'
              })
            }else {
              $Message({
                content: "验证码输入错误，请重新输入",
                type: 'success'
              })
              wx.redirectTo({
                url: '../home/index'
              })
            }
          }

        } catch (e) {
          $Message({
            content: "注册失败，请再试一次",
            type: 'error'
          })
          console.warn(e)
        }
      },
      handleClear() {
        if(this.phone)
          this.phone = ""
      },

    }
  }
</script>

<style lang="scss" scoped>
  @import "~_s/common/var";
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
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
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