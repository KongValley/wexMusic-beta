<template>
  <div class="c-head-bar">
    <div class="header"></div>
    <div class="center">
      <div class="center-items" :class="musicStatus" @click="handleToMusic">
        <i class="material-icons">music_note</i>
      </div>
      <div class="center-items" :class="homeStatus" @click="handleToHome">
        <i class="material-icons">home</i>
      </div>
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
  computed: {
    musicStatus() {
      return {
        'is-active': this.url.indexOf('/music/') > 0
      }
    },
    homeStatus() {
      return {
        'is-active': this.url.indexOf('/home/') > 0
      }
    }
  },
  mounted() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length-1]
    this.url = currentPage.route
  },
  methods: {
    handleToMusic() {
      if(this.url.indexOf('/music/') > 0)
        wx.navigateTo({
          url: '../music/index'
        })
    },
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