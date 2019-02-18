<template>
  <div class="p-ad">
    <div class="p-ad__button--group">
      <c-button icon="face" position="right" bold>
        <div class="p-ad__button">登录</div>
      </c-button>
      <c-button icon="plus_one" position="right" bold>
        <div class="p-ad__button">注册</div>
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
  background: linear-gradient(to bottom, #a770ef, #cf8bf3, #fdb99b);;
  @include e(button) {
    font-weight: bold;
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
