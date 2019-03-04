<template>
  <div class="p-sd">
    <div class="header">
      <div class="header-icon">
        <i class="material-icons" @click="handleToSearch">keyboard_backspace</i>
      </div>
      <div class="header-text">"{{}}"的搜索结果</div>
    </div>
    <div class="center">
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "search-detail",
  data() {
    return {

    };
  },
  methods: {
    handleToSearch() {
      wx.redirectTo({
        url: '../search/index'
      })
    }
  },
  onLoad(option) {
    console.log(option)
  }
}
</script>

<style lang="scss" scoped>
.p-sd {
  box-sizing: border-box;
  position: relative;
  display: flex;
  height: 40px;
  background-color: #DF4337;
  align-items: center;
  padding-right: 10px;
  padding-bottom: 5px;
  margin-bottom: 20px;
}
</style>