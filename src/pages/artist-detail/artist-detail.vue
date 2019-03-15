<template>
  <div class="p-artist-detail">
    <div class="header">
      <div class="header-left">
        <img src="https://chara-static-source.oss-cn-shanghai.aliyuncs.com/font/avator.jpg" alt="">
      </div>
      <div class="header-right">
        <div class="right-desc">
          <div class="desc-title">
            孔志鹏 (Chara)
          </div>
          <div class="desc-sub">
            被收藏xxxx次
          </div>
        </div>
        <div class="right-action">
          <div class="action-button">
            <div class="button-icon">
              <i class="material-icons">add</i>
            </div>
            <div class="button-text">
              收藏
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <i-tabs
        :active="currentPage"
        @change="handleChangeScroll"
        custom-class="center-tabs"
        color="#DF4337">
        <i-tab title="热门单曲" :title-style="titleStyle">
          <scroll-view
              class="list-cnt"
              mp:scroll-y="true"
              @scrolltolower="handleScrollToLower">
            <div class="list-item" v-for="item in result.songs.data" :key="item.id" @click="handlePlayMusic(item)">
              <div class="item-title">
                <div class="title-header">
                  <c-highlight :keyword="keyword" :str="item.name"></c-highlight>
                </div>
                <div class="title-desc">
                  <c-highlight :keyword="keyword" :str="`${handleSplitArtists(item.artists)} - ${item.album.name}`"></c-highlight>
                </div>
              </div>
              <div class="item-action" @click.stop="handleSongSheetActive(item)">
                <i class="material-icons">more_vert</i>
              </div>
            </div>
            <div v-if="result.songs.endFlag === false">
              <i-load-more></i-load-more>
            </div>
            <div v-if="result.songs.endFlag === true">
              <i-divider color="#DF4337" lineColor="#DF4337">我是有底线的 :)</i-divider>
            </div>
            <i-action-sheet
                :visible="songSheetVisible"
                :actions="currentSongAction"
                @click="handleClickSongSheet"
                @cancel="handleSongSheetCancel">
              <div slot="header" style="padding: 10px">
                <div>歌曲：{{currentSongInfo.name}}</div>
              </div>
            </i-action-sheet>
          </scroll-view>
        </i-tab>
        <i-tab title="专辑" :title-style="titleStyle"></i-tab>
        <i-tab title="艺人信息" :title-style="titleStyle"></i-tab>
      </i-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "artist-detail",
  data() {
    return {
      currentPage: 0,
      titleStyle: "color: #DF4337;",
      songSheetVisible: false
    }
  },
  methods: {
    handleChangeScroll({ detail }) {
      this.currentPage = detail.index
      console.log(detail)
    },
    handleScrollToLower() {

    },
    handleClickSongSheet() {
    },
    handleSongSheetCancel() {
      this.songSheetVisible = false
    }

  },
  computed: {

  }
}
</script>

<style lang="scss" scoped>
.p-artist-detail {
  width: 100%;
  height: 100%;
  .header {
    width: 100%;
    height: 150px;
    background-color: rgba(0,0,0,.8);
    display: flex;
    &-left {
      width: 150px;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100px;
        height: 100px;
      }
    }
    &-right {
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;
      .right-desc {
        .desc-title {
          padding-bottom: 7px;
          font-size: 20px;
          color: #ffffff;
        }
        .desc-sub {
          font-size: 14px;
          color: rgba(255, 255, 255, .4);
        }
      }
      .right-action {
        box-sizing: border-box;
        display: flex;
        flex-direction: row-reverse;
        padding-right: 20px;
        .action-button {
          font-size: 14px;
          padding: 10px 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: linear-gradient(to right,#ED6253,#CD4C43);
          border-radius: 50px;
          box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
          .button-icon {
            padding-right: 10px;
            i {
              font-size: 18px;
            }
          }
          .button-text {
            line-height: 1;
          }
        }
      }
    }
  }
  .center{
    /deep/ .center-tabs {
      // 覆写默认样式
      // 隐藏滚动条
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
      .van-tabs__line.van-tabs__line {
        bottom: 8px;
      }
      .list-cnt {
        width: 100%;
        height: calc(100vh - 86px);
        font-size: 14px;
        .list-item {
          width: 100%;
          height: 60px;
          position: relative;
          box-sizing: border-box;
          display: flex;
          padding-left: 10px;
          // MARK 真1rpx边框
          &::after {
            position: absolute;
            content: "";
            width: 100%;
            left: 0;
            bottom: 0;
            height: 1px;
            background-color: rgba(0, 0, 0, .1);
            transform: scale(1,0.5);
            transform-origin: center bottom;
          }
          .item-img {
            width: 40px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-right: 10px;
            img {
              width: 40px;
              height: 40px;
            }
          }
          .item-title {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .title-header {
              font-size: 14px;
              display: flex;
              align-items: center;line-height: 1;
              .title-sub-header {
                padding-left: 5px;
                color: rgba(0,0,0,.3);
                line-height: 1;
              }
            }
            .title-desc {
              color: rgba(0,0,0,.3);
              padding-top: 8px;
              font-size: 12px;
              display: flex;
              line-height: 1;
              align-items: center;
              .desc-header {
                padding-right: 5px;
              }
            }
          }
          .item-action {
            color: rgba(0,0,0, .2 );
            width: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>