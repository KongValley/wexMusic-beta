<template>
  <div class="p-ad">
    <div class="p-ad__button--group">
      <c-button position="right">
        <div class="p-ad__button">Sign In</div>
      </c-button>
      <c-button>
        <div class="p-ad__button">Sign Up</div>
      </c-button>
    </div>
  </div>
</template>

<script>
import CButton from '_c/button'
export default {
  name: 'p_ad',
  components: {
    CButton
  },
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
@import "~_s/common/var";
@import "~_s/mixins/mixin";
@include b(ad,p) {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @include e(button) {
    @include m(group) {
      position: absolute;
      box-sizing: border-box;
      bottom: 0;
      left: 0;
      display: flex;
      width: 100%;
      justify-content: space-around;
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 30px;
    }
  }
}
</style>
