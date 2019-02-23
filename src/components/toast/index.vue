<template>
	<div class="c-toast" :class="positionClass">
		<div class="c-toast__content">
			<slot name="content"></slot>
		</div>
		<div class="c-toast__action">
			<slot name="action"></slot>
		</div>
	</div>
</template>

<script>
import { oneOfList } from '_u'
export default {
  name: "c_toast",
  props: {
    position: {
      type: String,
      default: 'top',
      validator:(val) => oneOfList(val,['top','bottom'])
    }
  },
  computed: {
    positionClass() {
      return {
        'is-top': this.position === 'top',
        'is-bottom': this.position === 'bottom'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~_s/common/var";
@import "~_s/mixins/mixin";
@include b(toast,c) {
	position: fixed;
	min-width: $--toast-min-width;
	height: $--toast-min-height;
	box-sizing: border-box;
	padding: $--toast-content-padding;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: $--toast-default-color;
	background-color: $--toast-default-fill-color;
	transform: translate3d(-50%,0,0);
	box-shadow: $--toast-box-shadow;
	border-radius: 4px;

	@include e(content) {
		padding: 8px 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	@include e(action) {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-shrink: 0;
		margin-right: -16px;
		padding: 0 8px;
		margin-left: auto;
		color: $--toast-action-color;
	}

	@include when(bottom) {
		@include toast-bottom()
	}
	@include when(top) {
		@include toast-top
	}
}
</style>