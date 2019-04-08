<template>
  <div class="p-top">
    <div class="item" v-for="item in list" :key="item.id">
      <div class="item-wrapper" >
        <img :src="item.coverImgUrl" alt="" @click="handleToPlaylistDetail(item.id)">
      </div>
    </div>
    <c-footerbar></c-footerbar>
  </div>
</template>

<script>
import CFooterbar from '_c/footer-bar'
import { getAllToplistAPI } from '_a/top'
export default {
    name: "top",
  components: {
    CFooterbar
  },
    data() {
      return {
        list: []
      }
    },
    async mounted() {
      const res = await this.fetchAllToplist()
      this.list = res.data.list
    },
    methods: {
      /* router
      -------------------------- */
      handleToPlaylistDetail(id) {
        wx.navigateTo({
          url: '../playlist-detail/index?playlistId='+id
        })
      },
      /* fetch
      -------------------------- */
      async fetchAllToplist() {
        try {
          return await getAllToplistAPI()
        } catch (e) {
          console.warn(e)
        }
      }
    }
}
</script>

<style lang="scss" scoped>
.p-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding-top: 10px;
  padding-bottom: 60px;
  .item {
    &-wrapper {
      padding-top: 10px;
      padding-bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100px;
        height: 100px;
        border-radius: 4px;
        box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
      }
    }
  }
}
</style>