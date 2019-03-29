<template>
  <div class="p-mat">
    <div class="list-item"
       v-for="item in artists"
       :key="item.id"
       @click="handleToArtistDetail(item.id)"
    >
      <div class="left">
        <div class="left-img">
          <img :src="item.picUrl" alt="">
        </div>
      </div>
      <div class="right">
        <div class="right-title">{{item.name}}</div>
        <div class="right-sub-title">{{'专辑：'+item.albumSize}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserSubArtistAPI } from '_a/user'
export default {
  name: "my-artist",
  data() {
    return {
      artists: []
    }
  },
  async mounted() {
    const res = await this.fetchUserSubArtist()
    this.artists = res.data.data
  },
  methods: {
    /* router
    -------------------------- */
    handleToArtistDetail(id) {
      wx.navigateTo({
        url: '../artist-detail/index?artistId='+ id
      })
    },
    /* fetch
    -------------------------- */
    async fetchUserSubArtist() {
      try {
        return await getUserSubArtistAPI()
      } catch (e) {
        console.warn(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p-mat {
  padding: 0 10px;
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