<template>
	<button class="c-button"
		:class="buttonClass"
		:disabled="disable"
		@click="handleClick">
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
      default: 'text',
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
        'c-button--text': this.type==='text',
        'is-active': this.animate,
      }
    }
  },
  data () {
    return {
      animate: false,
      timer: null
    }
  },
  methods: {
    handleClick() {
      //console.log('点击Button了')
      if(this.timer) {
          return
      }
      this.animate = true
      //console.log('动画开始')
      this.timer = setTimeout(() => {
          this.animate = false
          clearTimeout(this.timer)
          this.timer = false
          //console.log('动画结束')
      }, 1000)
        this.$emit('click')
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
		}

		&:disabled {
			color: $--button-text-disabled-fill-color;
			background-color: transparent;
		}

		&:disabled::after {
			opacity: 0;
		}

		@include when(active) {
			&::after {
				left: 50%;
				top: 50%;
				animation: ripple-text 1s;
			}
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
		}

		&:active {
			box-shadow: $--button-contain-box-shadow-active;
		}

		&:disabled {
			color: $--button-disabled-font-color;
			background-color: $--button-contain-disabled-fill-color;
			box-shadow: none;
		}

		&:disabled::after {
			opacity: 0;
		}

		@include when(active) {
			&::after {
				left: 50%;
				top: 50%;
				animation: ripple-contain 1s;
			}
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

		@include when(active) {
			&::after {
				left: 50%;
				top: 50%;
				animation: ripple-text 1s;
			}
		}
	}
}
</style>