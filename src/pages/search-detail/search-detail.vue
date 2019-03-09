<template>
  <div class="p-sd">
    <div class="header">
      <div class="header-text">“{{keyword}}” 的搜索结果</div>
    </div>
    <div class="center">
      <i-tabs
        :current="currentPage"
        @change="handleChangeScroll"
        custom-class="center-tabs"
        :border="false"
        color="#fff">
        <i-tab title="单曲" :title-style="titleStyle">
          <scroll-view class="list-cnt"  v-if="currentType === typeList[0]" mp:scroll-y="true">
            <div class="list-item" v-for="i in 10" :key="i">
              <div class="item-title">
                <div class="title-header">
                  <c-highlight :keyword="keyword" :str="'海阔天空6667777'"></c-highlight>
                </div>
                <div class="title-desc">
                  <c-highlight :keyword="keyword" :str="'Mo'+' - '+'哈哈哈'"></c-highlight>
                </div>
              </div>
              <div class="item-action" @click="handleSongSheetActive">
                <i class="material-icons">more_vert</i>
              </div>
            </div>

            <i-action-sheet :visible="songSheetVisible" show-cancel @cancel="handleSongSheetCancel1"></i-action-sheet>
          </scroll-view>
        </i-tab>
        <i-tab title="专辑" :title-style="titleStyle">
          <div class="list-cnt"  v-if="currentType === typeList[1]">
            <div class="list-item">
              <div class="item-img">
                <img src="https://chara-static-source.oss-cn-shanghai.aliyuncs.com/font/avator.jpg" alt="">
              </div>
              <div class="item-title">
                <div class="title-header">
                  <!--专辑名-->
                  <c-highlight :keyword="keyword" :str="'Beautiful Girl'"></c-highlight>
                  <!--专辑如果是外语的，显示副标题中文名-->
                  <div class="title-sub-header">
                    <c-highlight :keyword="keyword" :str="'不要笑'"></c-highlight>
                  </div>
                </div>
                <div class="title-desc">
                  <c-highlight :keyword="keyword" :str="'哈哈'+' - '+'2011.9.14'"></c-highlight>
                </div>
              </div>
            </div>
          </div>
        </i-tab>
        <i-tab title="歌手" :title-style="titleStyle">
          <div class="list-cnt"  v-if="currentType === typeList[2]">
            <div class="list-item">
              <div class="item-img">
                <img src="https://chara-static-source.oss-cn-shanghai.aliyuncs.com/font/avator.jpg" alt="">
              </div>
              <div class="item-title">
                <div class="title-header">
                  <!--歌手名字-->
                  <c-highlight :keyword="keyword" :str="'梁咏琪'"></c-highlight>
                  <!--歌手外语名字-->
                  <div class="title-sub-header">
                    <c-highlight :keyword="keyword" :str="'gigi'"></c-highlight>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </i-tab>
        <i-tab title="歌单" :title-style="titleStyle">
          <div class="list-cnt"  v-if="currentType === typeList[3]">
            <div class="list-item">
              <div class="item-img">
                <img src="https://chara-static-source.oss-cn-shanghai.aliyuncs.com/font/avator.jpg" alt="">
              </div>
              <div class="item-title">
                <div class="title-header">
                  <!--专辑名-->
                  <c-highlight :keyword="keyword" :str="'Beautiful Girl'"></c-highlight>
                </div>
                <div class="title-desc">
                  <span>{{`${keyword} by `}}</span>
                  <c-highlight :keyword="keyword" :str="'哈哈'+' - '+'2011.9.14'"></c-highlight>
                  <span>{{`，播放${keyword}次`}}</span>
                </div>
              </div>
            </div>
          </div>
        </i-tab>
        <i-tab title="电台" :title-style="titleStyle">
          <div class="list-cnt" v-if="currentType === typeList[4]">
            <div class="list-item">
              <div class="item-img">
                <img src="https://chara-static-source.oss-cn-shanghai.aliyuncs.com/font/avator.jpg" alt="">
              </div>
              <div class="item-title">
                <div class="title-header">
                  <!--电台名-->
                  <c-highlight :keyword="keyword" :str="'Beautiful Girl'"></c-highlight>
                </div>
                <div class="title-desc">
                  <c-highlight :keyword="keyword" :str="'DZ不歪3'"></c-highlight>
                </div>
              </div>
            </div>
          </div>
        </i-tab>
      </i-tabs>
    </div>
  </div>
</template>

<script>
import CHighlight from '_c/searchHighlight'
import { getSearchDataAPI } from '_a/search'
import { typeList,resultList } from 'var'

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
      songSheetVisible: false,
      typeList: typeList,
      // 存放获取的各个数据
      result: {
        song: {
          offset: 0,
          list: []
        },
        album: {
          offset: 0,
          list: []
        },
        singer: {
          offset: 0,
          list: []
        },
        playlist: {
          offset: 0,
          list: []
        },
        dj: {
          offset: 0,
          list: []
        }
      },
      // 当前歌曲抽屉数据
      currentSongInfo: {
        name: "",
        author: "",
        album: ""
      }
    };
  },
  methods: {
    handleToSearch() {
      wx.redirectTo({
        url: '../search/index'
      })
    },
    handleChangeScroll({ detail }) {
      this.currentPage = detail.index
      this.currentType = typeList[detail.index]
      const currentResult = this.result[resultList[detail.index]]
      if(currentResult.list.length > 0)
        this.fetchSearchResult(currentResult.offset)
    },
    handleSongSheetActive() {
      // TODO 弹出抽屉
      this.songSheetVisible = true
    },
    async fetchSearchResult(offset) {
      try {
        // 1:单曲 10:专辑 100:歌手 1000:歌单 1002: 用户 1004: MV 1006: 歌词 1009: 电台
        const params = {
          keywords: this.keyword,
          type: this.currentType,
          offset: offset
        }
        const a = await getSearchDataAPI(params)
      } catch (e) {
        console.warn(e)
      }
    },
    // 关闭歌曲的抽屉
    handleSongSheetCancel1() {
      this.songSheetVisible = false
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
      // 隐藏滚动条
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
        height: calc(100vh - 86px);
        font-size: 14px;
        .list-item {
          width: 100%;
          height: 60px;
          box-sizing: border-box;
          display: flex;
          padding-left: 10px;
          box-shadow: inset  0 0 1px 0  rgba(0, 0, 0, .3);
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
              font-size: 16px;
              display: flex;
              align-items: center;
              .title-sub-header {
                color: rgba(0,0,0,.3);
                line-height: 1;
              }
            }
            .title-desc {
              color: rgba(0,0,0,.3);
              padding-top: 5px;
              font-size: 12px;
              display: flex;
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

      .van-tabs__line.van-tabs__line {
        bottom: 8px;
      }
    }
  }
}
</style>