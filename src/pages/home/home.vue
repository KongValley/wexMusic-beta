<template>
  <div class="p-home">
    <c-head></c-head>
    <div class="header">
      <div class="header-item" @click="handleToPlaylistAll">
        <div class="item-icon">
          <i class="material-icons">library_music</i>
        </div>
        <div class="item-text">
          歌单
        </div>
      </div>
      <div class="header-item" @click="handleToTopList">
        <div class="item-icon">
          <i class="material-icons">poll</i>
        </div>
        <div class="item-text">
          排行榜
        </div>
      </div>
      <div class="header-item" @click="handleToDjAll">
        <div class="item-icon">
          <i class="material-icons">radio</i>
        </div>
        <div class="item-text">
          电台
        </div>
      </div>
    </div>
    <div class="center">
      <div class="center-title">
        热门推荐
      </div>
      <div class="center-container">
        <div class="center-item" v-for="item in hotPlaylists" :key="item.id" @click="handleToPlaylistDetail(item.id)">
          <div class="wrapper">
            <img :src="item.picUrl" alt="">
            <div class="wrapper-text">
              ▶{{item.playCount/10000>=10 ? Math.round(item.playCount/10000) + '万': item.playCount}}
            </div>
          </div>
          <div class="text">
            {{item.name}}
          </div>
        </div>
      </div>
      <div class="center-title" style="padding-top: 10px">
        精选电台
      </div>
      <div class="center-container">
        <div class="center-item" v-for="item in djLists" :key="item.id" @click="handleToDjDetail(item.id)">
          <div class="wrapper">
            <img :src="item.picUrl" alt="">
            <div class="wrapper-text">
            </div>
          </div>
          <div class="text">
            {{item.name}}
          </div>
        </div>
      </div>
      <div class="center-title" style="padding-top: 10px">
        个性化推荐
      </div>
      <div class="center-container">
        <div class="center-item" v-for="item in playlists" :key="item.id" @click="handleToPlaylistDetail(item.id)">
          <div class="wrapper">
            <img :src="item.picUrl" alt="">
            <div class="wrapper-text">
              ▶{{item.playcount/10000>=10 ? Math.round(item.playcount/10000) + '万': Math.round(item.playcount)}}
            </div>
          </div>
          <div class="text">
            {{item.name}}
          </div>
        </div>
      </div>
    </div>
    <c-footerbar></c-footerbar>
  </div>
</template>

<script>
import CHead from '_c/bar'
import CFooterbar from '_c/footer-bar'
import {getPersonalizedPlaylistAPI, getRecommendResourceAPI} from '_a/recommend'
import {getDjRecommendAPI} from "_a/dj"
export default {
  name: "p_home",
  components: {
    CHead,
    CFooterbar
  },
  data() {
    return {
      playlists: [],
      hotPlaylists: [],
      djLists: []
    }
  },
  async mounted() {
    const res = await this.fetchRecommendResource()
    const resp = await this.fetchPersonalized()
    const radios = await this.fetchDjRecommend()
    this.playlists = res.data.recommend
    this.hotPlaylists = resp.data.result
    this.djLists = radios.data.djRadios
  },
  methods: {
    /* router
    -------------------------- */
    handleToPlaylistAll() {
      wx.navigateTo({
        url: '../playlist-all/index'
      })
    },
    handleToDjAll() {
      wx.navigateTo({
        url: '../dj-all/index'
      })
    },
    handleToTopList() {
      wx.navigateTo({
        url: '../top/index'
      })
    },
    handleToDjDetail(id) {
      wx.navigateTo({
        url: '../dj-detail/index?djId='+id
      })
    },
    handleToPlaylistDetail(id) {
      console.log('click')
      wx.navigateTo({
        url: '../playlist-detail/index?playlistId='+id
      })
    },
    /* fetch
    -------------------------- */
    async fetchRecommendResource() {
      try {
        return await getRecommendResourceAPI()
      } catch (e) {
        console.warn(e)
      }
    },
    async fetchPersonalized() {
      try {
        return await getPersonalizedPlaylistAPI()
      } catch (e) {
        console.warn(e)
      }
    },
    async fetchDjRecommend() {
      try {
        return await getDjRecommendAPI()
      } catch (e) {
        console.warn(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~_s/common/var";
.p-home {
  padding-bottom: 50px;
  .header {
    padding: 10px 0;
    display: flex;
    justify-content: space-around;
    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .item-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #DF4337;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          font-size: 18px;
        }
      }
      .item-text {
        padding-top: 5px;
        font-size: 14px;
      }
    }
  }
  .center {
    .center-title {
      font-size: 18px;
      padding-left: 10px;
      padding-bottom: 10px;
    }
    .center-container {
      padding: 0 20px;
      display: flex;
      /*justify-content: space-around;*/
      flex-wrap: wrap;
      justify-content: space-between;
      .center-item {
        .wrapper {
          position: relative;
          width: 100px;
          img {
            width: 100px;
            height: 100px;
            border-radius: 4px;
          }
          &-text {
            position: absolute;
            width: 100%;
            height: 40px;
            color: #ffffff;
            text-align: right;
            box-sizing: border-box;
            border-radius: 4px;
            padding-top: 5px;
            padding-right: 5px;
            background: linear-gradient(to bottom,rgba(0,0,0,.15),rgba(0,0,0,0));
            font-size: 12px;
            top: 0;
            right: 0;
          }
        }
        .text {
          width: 100px;
          font-size: 12px;
          padding-bottom: 5px;
        }
      }
    }
  }
}
</style>