<template>
	<div class="c-toast"
		:class="toastClass"
		v-if="selfVisible">
		<div class="c-toast__content">
			<slot name="content"></slot>
		</div>
		<div class="c-toast__action"
			v-if="!hideClose"
			:class="{'c-toast__action--unusual': status!=='default'}"
			>
			<i class="material-icons" @click="handleClose()">close</i>
		</div>
	</div>
</template>

<script>
import { oneOfList } from '_u'
export default {
  name: "c_toast",
  data () {
    return {
      selfVisible: false,
      selfAnimationEnd: true,
      selfVisibleTimer: null,
      selfAnimationTimer: null
    }
  },
  props: {
    position: {
      type: String,
      default: 'top',
      validator:(val) => oneOfList(val,['top','bottom','middle'])
    },
    duration: {
      type: Number,
      default: 3000
    },
    visible: {
      type: Boolean,
      default: false
    },
    hideClose: {
      type: Boolean,
      default: false
    },
    status: {
			type: String,
			default: 'default'
    },
    animate: {
      type: Number,
      default: 500
    }
  },
  computed: {
    toastClass() {
      return {
        [`is-${this.position}-enter`]: this.selfAnimationEnd,
        [`is-${this.status}`]: true,
        [`is-${this.position}-leave`]: !this.selfAnimationEnd
      }
    }
  },
  watch: {
    visible(val) {
      this.selfVisible = val
    },
    selfVisible(val) {
      if(this.selfTimer) {
        clearTimeout(this.selfTimer)
        this.selfTimer = null
      }
      if(this.selfAnimationTimer) {
        return
      }

      // if(!val) {
      //   this.selfAnimationEnd = false
      //   this.selfAnimationTimer = setTimeout(() => {
      //       this.selfAnimationEnd = true
      //   }, this.animate)
      // }

      if(val) {
        this.selfTimer = setTimeout(() => {
          this.selfAnimationEnd = false
          this.selfAnimationTimer = setTimeout(() => {
            this.selfVisible = false
            this.selfAnimationEnd = true
            this.$emit('update:visible',false)
            clearTimeout(this.selfAnimationTimer)
            this.selfAnimationTimer = null
          }, this.animate)
        }, this.duration)
      }
    }
  },
  created() {
    this.selfVisible = this.visible
  },
  methods: {
    handleClose() {
      if(this.selfTimer) {
          clearTimeout(this.selfTimer)
          this.selfTimer = null
      }

      if(this.selfAnimationTimer) {
          clearTimeout(this.selfAnimationTimer)
          this.selfAnimationTimer = null
      }
      this.$emit('close')
      this.selfAnimationEnd = false
      this.selfAnimationTimer = setTimeout(() => {
          this.selfVisible = false
          this.selfAnimationEnd = true
          this.$emit('update:visible',false)
          clearTimeout(this.selfAnimationTimer)
          this.selfAnimationTimer = null
      }, this.animate)
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
	left: 50%;
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
		@include m(unusual) {
			color: $--color-white;
		}
	}

	@include when(bottom-enter) {
		bottom: 0;
		animation: slide-up-enter $--toast-animation-duration;
	}

	@include when(top-enter) {
		top: 0;
		animation: slide-down-enter $--toast-animation-duration;
	}

	@include when(middle-enter) {
		top: 50%;
		transform: translate3d(-50%,-50%,0);
		animation: fade-in-enter $--toast-animation-duration;
	}

	@include when(bottom-leave) {
		bottom: 0;
		animation: slide-up-leave $--toast-animation-duration;
	}

	@include when(top-leave) {
		top: 0;
		animation: slide-down-leave $--toast-animation-duration;
	}

	@include when(middle-leave) {
		top: 50%;
		transform: translate3d(-50%,-50%,0);
		animation: fade-in-leave $--toast-animation-duration;
	}

	@include when(default) {
		background-color: $--toast-default-fill-color;
	}

	@include when(success) {
		background-color: $--toast-success-fill-color;
	}
	@include when(info) {
		background-color: $--toast-info-fill-color;
	}
	@include when(warn) {
		background-color: $--toast-warning-fill-color;
	}
	@include when(error) {
		background-color: $--toast-error-fill-color;
	}
}
</style>