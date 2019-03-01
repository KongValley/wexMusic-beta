<template>
  <div class="p-home">
    <div class="p-home__search">
      <div style="width: 70%;">
        <c-input label="Search" v-model.lazy="search" ></c-input>
      </div>
      <div style="padding-left: 15px">
        <c-button type="contain">
          <i class="material-icons" style="font-size: 28px;">search</i>
        </c-button>
      </div>
    </div>
    <div class="p-home__card">
      <c-title text="HOT"></c-title>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
import { getRecommendResourceAPI } from '_a/recommend'
import CInput from '_c/input'
import CButton from '_c/button'
import CTitle from './title'
export default {
  name: "p_home",
  components: {
    CInput,
    CButton,
    CTitle
  },
  data() {
    return {
      search: ""
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~_s/common/var";
@import "~_s/mixins/mixin";
@include b(home,p) {
  @include e(search) {
    display: flex;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    align-items: center;
    padding: 0 25px;
  }
  @include e(card) {
    box-sizing: border-box;
    width: 100%;
    padding: 0 25px;
  }
}
</style>