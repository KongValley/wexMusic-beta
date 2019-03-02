<template>
  <div class="p-home">
    <c-head></c-head>
  </div>
</template>

<script>
import CHead from '_c/bar'
import { getRecommendResourceAPI } from '_a/recommend'
export default {
  name: "p_home",
  components: {
    CHead
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~_s/common/var";
.p-home {
}
</style>