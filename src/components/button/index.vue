<template>
	<button class="c-button" :class="buttonClass" :disabled="disable" @click="$emit('click')">
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
      default: 'contain',
      validator:(val)=>oneOfList(val,['contain','outline','text'])
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
        'c-button--contain':  this.type==='contain',
        'c-button--text': this.type==='text'
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
		height: $--button-height;
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
		cursor: pointer;

		vertical-align: middle;
		text-align: center;
		text-overflow: ellipsis;
		line-height: $--button-font-line-height;

		@include m(text) {
			border: none;
			color: $--button-text-font-color;
			background-color: $--button-text-fill-color;
			&::after {
				content: "";
				position: absolute;
				left: 50%;
				top: 50%;
				padding: 50%;
				border-radius: 50%;
				width: $--button-modal-width;
				height: $--button-modal-height;
				background-color: currentColor;
				opacity: 0;
				transform: translate(-50%, -50%) scale(1);
				transition: opacity 1s, transform .5s;
			}

			&:active::after {
				opacity: 0.16;
				transform: translate(0%, 0%) scale(0);
				transition: transform 0s;
			}

			&:disabled {
				color: $--button-text-disabled-fill-color;
				background-color: transparent;
			}

			&:disabled::after {
				opacity: 0;
			}
		}

		@include m(contain) {
			border: none;
			color: $--button-contain-font-color;
			background-color: $--button-contain-fill-color;
			transition: box-shadow 0.2s;
			box-shadow: $--button-contain-box-shadow-base;
			&::after {
				content: "";
				position: absolute;
				left: 50%;
				top: 50%;
				border-radius: 50%;
				padding: 50%;
				width: $--button-modal-width;
				height: $--button-modal-height;
				background-color: $--button-contain-modal-fill-color;
				opacity: 0;
				transform: translate(-50%, -50%) scale(1);
				transition: opacity 1s, transform 0.5s;
			}

			&:active {
				box-shadow: $--button-contain-box-shadow-active;
			}

			&:active::after {
				left: 50%;
				top: 50%;
				opacity: 0.32;
				transform: translate(0%,0%) scale(0);
				transition: transform 0s;
			}

			&:disabled {
				color: $--button-disabled-font-color;
				background-color: $--button-contain-disabled-fill-color;
				box-shadow: none;
			}

			&:disabled::after {
				opacity: 0;
			}
		}

		@include m(outline) {
			color: $--button-outline-font-color;
			border: $--button-border-style $--button-border-width $--button-border-color;
			background-color: $--button-outline-fill-color;
			height: $--button-height;

			&::after {
				content: "";
				position: absolute;
				left: 50%;
				top: 50%;
				padding: 50%;
				border-radius: 50%;
				width: $--button-modal-width;
				height: $--button-modal-height;
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
				background-color: $--button-outline-disabled-fill-color;
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