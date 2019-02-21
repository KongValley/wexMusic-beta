<template>
	<button class="c-button" :class="buttonClass" :disabled="disable">
		<div class="c-button__container">
			<slot></slot>
		</div>
	</button>
</template>

<script>
import { oneOfList } from '_u';
export default {
  name: "c_button",
  props: {
    type: {
      type: String,
      default: 'outline',
      validator:(val)=>oneOfList(val,['contain','outline'])
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClass() {
      return {
        'c-button--outline':  this.type==='outline',
        'c-button--contain':  this.type==='contain'
      }
    }
  }
}
</script>

<style lang="scss">
	@import "~_s/common/var";
	@import "~_s/mixins/mixin";
	@include b(button,c) {
		min-width: $--button-min-width;
		height: 36px;
		display: inline-block;
		position: relative;
		overflow: hidden;
		background-color: $--button-default-fill;
		color: $--button-default-color;
		font-size: $--button-font-size;
		font-weight: $--button-font-weight-default;
		user-select: none;
		box-sizing: border-box;
		border-radius: $--button-border-radius;
		padding: $--button-padding-vertical $--button-padding-horizontal;
		// box-shadow: $--button-default-box-shadow;
		cursor: pointer;

		vertical-align: middle;
		text-align: center;
		text-overflow: ellipsis;
		line-height: 36px;

		@include m(contain) {
			border: none;
			color: $--button-contain-font-color;
			background-color: $--button-contain-fill-color;
			transition: box-shadow 0.2s;

			&::before {
				content: "";
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				background-color: rgb(255,255,255);
				opacity: 0;
				transition: opacity 0.2s;
			}

			&::after {
				content: "";
				position: absolute;
				left: 50%;
				top: 50%;
				border-radius: 50%;
				padding: 50%;
				width: 32px; /* Safari */
				height: 32px; /* Safari */
				background-color: rgb(255,255,255);
				opacity: 0;
				transform: translate(-50%, -50%) scale(1);
				transition: opacity 1s, transform 0.5s;
			}
			&:focus,&:hover {
				box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
			}

		}

		@include m(outline) {
			color: $--button-outline-font-color;
			border: $--button-border-style $--button-border-width $--button-border-color;
			background-color: transparent;
			height: 40px;

			&::after {
				content: "";
				position: absolute;
				left: 50%;
				top: 50%;
				padding: 50%;
				border-radius: 50%;
				width: 50px;
				height: 50px;
				background-color: currentColor;
				opacity: 0;
				transform: translate(-50%, -50%) scale(1);
				transition: opacity 1s, transform .5s;
			}

			&:active::after {
				opacity: 0.16;
				left: 50%;
				top: 50%;
				transform: translate(0%, 0%) scale(0);
				transition:  transform 0s;
			}

			&:disabled {
				color: $--button-disabled-font-color;
				background-color: transparent;
				cursor: initial;
			}

			&:disabled::before {
				opacity: 0;
			}

			&:disabled::after {
				opacity: 0;
			}
		}
	}
</style>