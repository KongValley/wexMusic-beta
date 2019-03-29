<template>
  <div class="c-footer-bar">
    <div class="item">
      <i class="material-icons" @click="handleToHome">home</i>
    </div>
    <div class="item">
      <i class="material-icons" @click="handleToPlayMusic">headset</i>
    </div>
  </div>
</template>

<script>
  export default {
    name: "footer-bar",
    methods: {
      handleToPlayMusic() {
        wx.navigateTo({
          url: '../../pages/play-music/index'
        })
      },
      handleToHome() {
        wx.navigateTo({
          url: '../../pages/home/index'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.c-footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #DF4337;
  box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
  .item {
    color: #fff;
    padding: 10px;
  }
}
</style>