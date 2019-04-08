<template>
  <div class="p-mdj">
    <div class="list-item"
       v-for="item in djs"
       :key="item.id"
       @click="handleToDjDetail(item.id)"
    >
      <div class="left">
        <div class="left-img">
          <img :src="item.picUrl" alt="">
        </div>
      </div>
      <div class="right">
        <div class="right-title">{{item.name}}</div>
        <div class="right-sub-title">{{'by '+item.dj.nickname}}</div>
      </div>
    </div>
    <c-footerbar></c-footerbar>
  </div>
</template>

<script>
import CFooterbar from '_c/footer-bar'
import { getDjSublistAPI } from '_a/dj'
  export default {
    name: "my-dj",
    components: {
      CFooterbar
    },
    data() {
      return {
        djs: []
      }
    },
    async mounted() {
      const res = await this.fetchMyDj()
      this.djs = res.data.djRadios
    },
    methods: {
      /* router
      -------------------------- */
      handleToDjDetail(id) {
        wx.navigateTo({
          url: '../dj-detail/index?djId='+id
        })
      },
      /* fetch
      -------------------------- */
      async fetchMyDj() {
        try {
          return await getDjSublistAPI()
        } catch (e) {
          console.warn(e)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.p-mdj {
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 50px;
  box-sizing: border-box;
  .list-item {
    display: flex;
    padding: 10px 0;
    .left {
      display: flex;
      align-items: center;
      &-img {
        display: flex;
        align-items: center;
        padding-right: 10px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 4px;
        }
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      &-title {
        font-size: 16px;
      }
      &-sub-title {
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
        font-size: 14px;
        color: rgba(0, 0, 0, .3);
      }
    }
  }
}
</style>