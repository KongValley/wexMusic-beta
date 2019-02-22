<template>
	<div>
		<c-input label="Email" v-model="value"></c-input>
		<input type="text" placeholder="">
	</div>
</template>

<script>
import CInput from '_c/input'
export default {
  name: "p_signin",
  components: {
    CInput
  },
  data() {
    return {
      value: "2333"
    }
  }
}
</script>

<style scoped>

</style>