<template>
	<div class="p-signin">
		<c-toast>
			<div slot="content"> 11111111 </div>
			<div slot="action">
				<i class="material-icons">close</i>
			</div>
		</c-toast>
		<div class="p-signin__form">
			<c-input label="Phone" v-model.lazy="phone"></c-input>
			<c-input label="Password" v-model.lazy="password" type="password"></c-input>
		</div>
		<c-button type="contain" class="p-signin__button" @click="handleSubmit()">
			<div class="p-ad__button">Sign In</div>
		</c-button>
	</div>
</template>

<script>
import { loginByPhoneAPI } from '_a/login'
import CInput from '_c/input'
import CToast from '_c/toast'
import CButton from '_c/button'
export default {
  name: "p_signin",
  components: {
    CInput,
    CButton,
    CToast
  },
  data() {
    return {
      phone: "",
      password: ""
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
        console.log(res)
      } catch (e) {
		    console.warn(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~_s/common/var";
@import "~_s/mixins/mixin";
@include b(signin,p) {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	@include e(form) {
		width: 75%;
		margin-top: 100px;
		.c-input:nth-child(1) {
			margin-bottom: 15px;
		}
	}
	@include e(button) {
		margin-top: 50px;
		width: 75%;
	}
}
</style>