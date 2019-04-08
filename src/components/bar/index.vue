<template>
  <div class="c-head-bar">
    <div class="header">
      <i class="material-icons" @click="handleToMyMusic">face</i>
    </div>
    <div class="center">
      个性推荐
    </div>
    <div class="footer">
      <i class="material-icons" @click="handleToSearch">search</i>
    </div>
  </div>
</template>

<script>
export default {
  name: "c-head-bar",
  data() {
    return {
      url: ''
    }
  },
  mounted() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length-1]
    this.url = currentPage.route
  },
  methods: {
    handleToHome() {
      if(this.url.indexOf('/home/') > 0)
        wx.navigateTo({
          url: '../home/index'
        })
    },
    handleToSearch() {
      wx.navigateTo({
        url: '../search/index'
      })
    },
    handleToMyMusic() {
      wx.navigateTo({
        url: '../my-music/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~_s/common/var";
.c-head-bar {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  background-color: $--color-primary;
  color: $--color-white;
  .center{
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    .center-items {
      width: 40px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: rgba(0, 0, 0, .2);
    }
    .is-active {
      color: #fff;
    }
  }
  .header,.footer {
    width: 40px;
    height: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>