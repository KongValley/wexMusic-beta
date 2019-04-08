<template>
  <div class="p-playlist-all">
    <div class="header" @click="handleShowLabelModal">当前标签：{{currentLabel.name ? currentLabel.name : '暂无标签'}}</div>
    <scroll-view
      class="center"
      mp:scroll-y="true"
      @scrolltolower="handleScrollToLower"
    >
      <div class="center-container">
        <div class="center-item" v-for="item in currentData" :key="item.id" @click="handleToDjDetail(item.id)">
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
    </scroll-view>
    <i-action-sheet
      :visible="labelModalVisible"
      @cancel="handleCloseLabelModal">
      <div slot="header" class="label-list">
        <div class="label-item" v-for="item in labelList" :key="item.id" @click="handleClickLabelSheet(item)">{{item.name}}</div>
      </div>
    </i-action-sheet>
    <c-footerbar></c-footerbar>
  </div>
</template>

<script>
  import CFooterbar from '_c/footer-bar'
  import {
    getDjCatelistAPI,
    getDjRecommendTypeAPI
  } from '_a/dj'
  export default {
    name: "playlist-all",
    components: {
      CFooterbar
    },
    data() {
      return {
        currentLabel: '',
        labelModalVisible: false,
        labelList: [],
        currentData: [],
        endFlag: false
      }
    },
    async mounted() {
      const res = await this.fetchDjCategory()
      this.labelList = res.data.categories
      this.currentLabel = this.labelList[0]
      const resp = await this.fetchDjListTop()
      this.currentData = resp.data.djRadios
    },
    methods: {
      handleToDjDetail(id) {
        wx.navigateTo({
          url: '../dj-detail/index?djId='+id
        })
      },
      handleShowLabelModal() {
        this.labelModalVisible = true
      },
      handleCloseLabelModal() {
        this.labelModalVisible = false
      },
      async handleClickLabelSheet(val) {
        if(this.currentLabel.id === val.id) {
          this.labelModalVisible = false
          return
        }
        this.currentLabel = val
        console.log(this.currentLabel)
        this.currentData = []
        const res = await this.fetchDjListTop()
        this.currentData.push(...res.data.djRadios)
        this.labelModalVisible = false
      },
      /* fetch
      -------------------------- */
      async fetchDjCategory() {
        try {
          return await getDjCatelistAPI()
        } catch (e) {
          console.warn(e)
        }
      },
      async fetchDjListTop() {
        try {
          const param = {
            type: this.currentLabel.id
          }
          return await getDjRecommendTypeAPI(param)
        } catch (e) {
          console.warn(e)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.p-playlist-all {
  width: 100%;
  height: 100%;
  .header {
    height: 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding-left: 20px;
    font-size: 14px;
  }
  .center {
    padding-bottom: 50px;
    height: calc(100vh - 90px);
    ::-webkit-scrollbar {
      width: 4px;
      height: 6px;
      color: transparent;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #DF4337;
    }
    .center-container {
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;
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
  .label-list {
    padding-top: 15px;
    padding-left: 10px;
    padding-right: 10px;
    max-height: 500px;
    display: flex;
    flex-wrap: wrap;

    .label-item {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      padding: 7px 10px;
      /*border: 2px solid #DF4337;*/
      box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
      border-radius: 4px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>