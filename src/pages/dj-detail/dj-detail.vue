<template>
  <div class="p-dj-detail">
    <div class="header">
      <div class="header-left">
        <img :src="djImg" alt="">
      </div>
      <div class="header-right">
        <div class="right-desc">
          <div class="desc-title">
            {{djName}}
          </div>
          <div class="desc-sub">
            <div>{{subCount+'人已订阅'}}</div>
          </div>
        </div>
        <div class="right-action">
          <div class="action-button" @click="handleSubDj(djId)">
            <div class="button-icon">
              <i class="material-icons" v-if="!followed">favorite_border</i>
              <i class="material-icons" v-if="followed">favorite</i>
            </div>
            <div class="button-text" v-if="!followed">
              订阅
            </div>
            <div class="button-text" v-if="followed">
              已订阅
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <scroll-view
        class="list-cnt"
        mp:scroll-y="true"
        @scrolltolower="handleScrollToLower">
        <div class="list-item" v-for="item in programs.data" :key="item.id" @click="handlePlay(item)">
          <div class="item-title">
            <div class="title-header">
              {{item.name}}
            </div>
            <div class="title-desc">
              {{`${handleFormatTime(item.createTime)+' 时长：'+handleFormatDuration(item.duration)}`}}
            </div>
          </div>
        </div>
        <i-load-more v-if="programs.data.length !== programs.count"></i-load-more>
        <i-divider color="#DF4337" lineColor="#DF4337" v-if="programs.data.length === programs.count">我是有底线的 :)</i-divider>
      </scroll-view>
      <i-toast id="toast"></i-toast>
      <c-footerbar></c-footerbar>
    </div>
  </div>
</template>

<script>
  import {
    getDjProgramAPI,
    getSubDjAPI
  } from '_a/dj'
  import {
    getMusicUrlAPI
  } from '_a/song'
  import {
    formatTime,formatDuration
  } from "_u"
  import CFooterbar from '_c/footer-bar'
  const { $Toast } = require('_v/base/index')
  export default {
    name: "album-detail",
    components: {
      CFooterbar
    },
    data() {
      return {
        djId: "",
        djImg: "",
        djName: "",
        offset: 0,
        followed: false,
        subCount: 0,
        programSheetVisible: false,
        programs: {
          // 存放数据
          data: [],
          count: 0
        },
        // 当前歌曲抽屉数据
        currentProgramInfo: {
          name: "",
          id: "",
          duration: 0
        }
      }
    },
    methods: {
      /* methods
      -------------------------- */
      handleSongSheetCancel() {
        this.programSheetVisible = false
      },
      handleFormatTime(time) {
        return formatTime(new Date(time))
      },
      async handleScrollToLower() {
        if(this.programs.data.length !== this.programs.count) {
          this.offset = this.offset + 1
          const res = await this.fetchPrograms()
          this.programs.data.push(...res.data.programs)
        }
      },
      handleFormatDuration(time) {
        return formatDuration(time)
      },
      async handlePlay(item) {
        const res = await this.fetchDjUrl(item.mainSong.id)
        const audio = wx.getBackgroundAudioManager()
        audio.title = item.name
        audio.src = res.data.data[0].url
      },
      async handleSubDj(id) {
        try {
          const params = {
            rid: id,
            t: this.followed ? 0 : 1
          }
          await getSubDjAPI(params)
          this.followed = !this.followed
        } catch (e) {
          console.warn(e)
        }
      },
      /* router
      -------------------------- */
      /* fetch
      -------------------------- */
      async fetchPrograms() {
        try {
          const params = {
            rid: this.djId,
            offset: this.offset * 30
          }
          return await getDjProgramAPI(params)
        } catch (e) {
          console.warn(e)
        }
      },
      async fetchDjUrl(id) {
        try {
          const params = {
            id: id
          }
          return await getMusicUrlAPI(params)
        } catch (e) {
          console.log(e)
        }
      }
    },
    async mounted() {
      this.djId = this.$mp.options.djId
      const res = await this.fetchPrograms()
      const _ = res.data.programs[0]
      this.djImg = _.radio.picUrl
      this.djName = _.radio.name
      this.followed = _.radio.subed
      this.subCount = _.radio.subCount
      this.programs.data = res.data.programs
      this.programs.count = res.data.count
    }
  }
</script>

<style lang="scss" scoped>
  .p-dj-detail {
    width: 100%;
    height: 100%;
    padding-bottom: 50px;
    box-sizing: border-box;
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
          justify-content: space-between;
          padding-top: 10px;
          padding-right: 20px;
          .action-button {
            font-size: 14px;
            padding: 10px 20px;
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
      .list-cnt {
        // 覆写默认样式
        // 隐藏滚动条
        ::-webkit-scrollbar {
          width: 0;
          height: 0;
          color: transparent;
        }
        width: 100%;
        height: calc(100vh - 150px);
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
            overflow: hidden;
            .title-header {
              font-size: 14px;
              display: flex;
              align-items: center;
              line-height: 1;
              .title-sub-header {
                /*padding-left: 5px;*/
                color: rgba(0,0,0,.3 );
                line-height: 1;
              }
            }
            .title-desc {
              color: rgba(0,0,0,.3);
              padding-top: 8px;
              font-size: 12px;
              display: flex;
              align-items: center;
              line-height: 1;
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
</style>