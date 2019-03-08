<template>
  <div>
    <span v-for="item in searchArr" :key="item" :class="{'is-high-light': item === keyword }">{{item}}</span>
  </div>
</template>

<script>
export default {
  name: "search-high-light",
  props: {
    keyword: {
      type: String,
      required: true
    },
    str: {
      type: String,
      required: true
    }
  },
  methods: {
    _getHighlightStrArr(str, key) {
      return str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%')
    }
  },
  computed: {
    searchArr() {
      return this._getHighlightStrArr(this.str, this.keyword)
    },
  }
}
</script>

<style lang="scss" scoped>
.is-high-light {
  color: #6188B5;
}
</style>