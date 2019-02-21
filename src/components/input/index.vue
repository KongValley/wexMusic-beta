<template>
  <div>
    <label class="c-input">
      <input placeholder="">
      <span></span>
    </label>
  </div>
</template>

<script>
import { oneOfList } from '_u'
export default {
  name: "c_input",
  data() {
    return {};
  },
  props: {
    label: {
      type: String,
      default: '标题'
    },
    type: {
      type: String,
      default: 'input',
      validator:(val)=>oneOfList(val,['input','textarea'])
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
