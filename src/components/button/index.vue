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
	@import "~_s/common/var";
	@import "~_s/mixins/mixin";
	@include b(button,c) {
		display: inline-flex;
		position: relative;
		overflow: hidden;
		line-height: 1;
		justify-content: center;
		align-items: center;
		background-color: $--button-default-fill;
		color: $--button-default-color;
		font-size: $--button-font-size;
		font-weight: $--button-font-weight-default;
		user-select: none;
		box-sizing: border-box;
		border-radius: $--button-border-radius;
		padding: $--button-padding-vertical $--button-padding-horizontal;
		box-shadow: $--button-default-box-shadow;
		&:active {
			color: mix($--color-white,$--button-default-color,$--button-hover-tint-percent);
			box-shadow: $--button-default-active-box-shadow;
			outline: none;
		}
		@include e(text) {
			order: 2;
			@include m(bold) {
				font-weight: $--button-font-weight-large;
			}
		}
		@include e(icon) {
			order: 1;
			@include m(left) {
				margin-right: 5px;
			}
			@include m(right) {
				margin-left: 5px;
			}
		}
		@include m(medium) {
		}
		@include when(right) {
			@at-root {
				@include e(text) {
					order: 1;
				}
				@include e(icon) {
					order: 2;
				}
			}
		}
	}
</style>