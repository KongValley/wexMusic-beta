<template>
  <div class="p-sd">
    <div class="header">
      <div class="header-text">“{{keyword}}” 的搜索结果</div>
    </div>
    <div class="center">
      <i-tabs :current="currentPage" @change="handleChangeScroll" custom-class="center-tabs" :border="false" color="#fff">
        <i-tab title="单曲" :title-style="titleStyle">
          <div class="list-cnt"  v-if="currentType === typeList[0]">
            <div class="list-item">
              <div class="item-title">
                <div class="title-header">
                  <c-highlight :keyword="keyword" :str="'海阔天空6667777'"></c-highlight>
                </div>
                <div class="title-desc">
                  <c-highlight :keyword="keyword" :str="'Mo-哈哈哈'"></c-highlight>
                </div>
              </div>
              <div class="item-action">

              </div>
            </div>
          </div>
        </i-tab>
        <i-tab title="专辑" :title-style="titleStyle">
          <div class="list-cnt"  v-if="currentType === typeList[1]">
            <div class="list-item"></div>
          </div>
        </i-tab>
        <i-tab title="歌手" :title-style="titleStyle">
          <div class="list-cnt"  v-if="currentType === typeList[2]">
            <div class="list-item"></div>
          </div>
        </i-tab>
        <i-tab title="歌单" :title-style="titleStyle">
          <div class="list-cnt"  v-if="currentType === typeList[3]">
            <div class="list-item"></div>
          </div>
        </i-tab>
        <i-tab title="电台" :title-style="titleStyle">
          <div class="list-cnt" v-if="currentType === typeList[4]">
            <div class="list-item"></div>
          </div>
        </i-tab>
      </i-tabs>
      <div class="tab-footer"></div>
    </div>
  </div>
</template>

<script>
import CHighlight from '_c/searchHighlight'
import { getSearchDataAPI } from '_a/search'
const typeList = [
  1, // 单曲
  10, // 专辑
  100, // 歌手
  1000, // 歌单
  1009 // 电台
]
export default {
  name: "search-detail",
  components: {
    CHighlight
  },
  data() {
    return {
      keyword: "",
      currentPage: 0,
      titleStyle: "background:#DF4337;color:#fff;",
      currentType: 1, // 1:单曲 10:专辑 100:歌手 1000:歌单 1009: 电台
      albumsResult: {
        offset: 0,
        list: []
      },
      songsResult: {
        offset: 0,
        list: []
      },
      djsResult: {
        offset: 0,
        list: []
      },
      singersResult: {
        offset: 0,
        list: []
      },
      playlistResult: {
        offset: 0,
        list: []
      },
      typeList: typeList
    };
  },
  methods: {
    handleToSearch() {
      wx.redirectTo({
        url: '../search/index'
      })
    },
    handleChangeScroll({detail}) {
      this.currentPage = detail.index
      this.currentType = typeList[detail.index]
    },
    async fetchSearchResult() {
      try {
        // 1:单曲 10:专辑 100:歌手 1000:歌单 1002: 用户 1004: MV 1006: 歌词 1009: 电台
        const params = {
          keywords: this.keyword,
          type: this.currentType
        }
        const a = await getSearchDataAPI(params)
      } catch (e) {
        console.warn(e)
      }
    }
  },
  onLoad(option) {
    this.keyword = option.search
    // test
    this.keyword = '海阔天空'
  }
}
</script>

<style lang="scss" scoped>
.p-sd {
  position: relative;
  .header {
    display: flex;
    width: 100%;
    height: 40px;
    font-size: 16px;
    padding-left: 10px;
    padding-right: 10px;
    align-items: center;
    background-color: #DF4337;
    box-sizing: border-box;
    color: #fff;
  }
  .center {
    /deep/ .center-tabs {
      /*隐藏滚动条*/
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;

      }
      .van-tab {
        box-sizing: border-box;
        padding:0;
      }

      .list-cnt {
        width: 100%;
        height: 100%;
        font-size: 14px;
      }

      .van-tabs__line.van-tabs__line {
        bottom: 8px;
      }
    }
  }
}
</style>