<template>
  <div class="p-sd">
    <div class="header">
      <div class="header-text">"{{keyword}}" 的搜索结果</div>
    </div>
    <div class="center">
      <i-tabs :current="currentPage" @change="handleChangeScroll" custom-class="center-tabs" :border="false" color="#fff">
        <i-tab title="单曲" :title-style="titleStyle">
        </i-tab>
        <i-tab title="歌单" :title-style="titleStyle">

        </i-tab>
        <i-tab title="专辑" :title-style="titleStyle">

        </i-tab>
      </i-tabs>
      <div class="tab-footer"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "search-detail",
  data() {
    return {
      keyword: "",
      currentPage: 1,
      titleStyle: "background:#DF4337;color:#fff;"
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
    }
  },
  onLoad(option) {
    this.keyword = option.search
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
      .van-tabs--line.van-tabs__wrap {
      }
      .van-tab {
        box-sizing: border-box;
        padding:0;
      }
    }
    .tab-footer {
      background-color: #DF4337;
      height: 5px;
    }
  }
}
</style>