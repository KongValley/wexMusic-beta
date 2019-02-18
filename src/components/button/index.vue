<template>
	<div class="c-button" :class="{'is-right': isRight}">
		<div class="c-button__text">
			<slot></slot>
		</div>
		<i class="material-icons c-button__icon" :class="iconClass" v-if="icon">{{icon}}</i>
	</div>
</template>

<script>
  export default {
    name: "c_button",
    props: {
      icon: {
        type: String,
        default: ''
      },
      position: {
        type: String,
        default: 'left'
      }
    },
    computed: {
      iconClass() {
        if (this.position === 'right') { return 'c-button__icon--right' } else return 'c-button__icon--left'
      },
      isRight() {
        return this.position === 'right'
      }
    }
  }
</script>

<style lang="scss">

</style>