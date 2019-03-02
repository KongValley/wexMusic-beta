<template>
  <div class="p-search">
    <div class="header">
      <div class="header-icon">
        <i class="material-icons" @click="handleToHome">keyboard_backspace</i>
      </div>
      <input
        class="header-input"
        type="text"
        placeholder="搜索"
        v-model="search"
        placeholder-class="header-place-holder"
        @click="handleSearch">
    </div>
    <div class="card">
      <div class="title">
        热门搜索
      </div>
      <div class="body">
        <div class="target">
          绿皮书
          <div class="hot">热</div>
        </div>
      </div>
    </div>
    <div class="card" v-if="historyList.length">
      <div class="title">
        <div class="text">历史记录</div>
        <div class="icon">
          <i class="material-icons" @click="handleDelete">delete_outline</i>
        </div>
      </div>
    </div>
    <i-modal :visible="modal" @ok="handleOk" @cancel="handleCancel">
      <div>确定清空全部历史纪录</div>
    </i-modal>
  </div>
</template>

<script>
export default {
  name: "p-search",
  data() {
    return {
      search: "",
      modal: false
    }
  },
  methods: {
    handleSearch() {
      const app= getApp()
      if(!app.globalData.serachHistory) {
        app.globalData.serachHistory = []
      }
      if(this.search.length) {
        app.globalData.serachHistory.push(this.search)
      }
    },
    handleToHome() {
      wx.redirectTo({
        url: '../home/index'
      })
    },
    handleCancel() {
      this.modal = false
    },
    handleOk() {
      const app= getApp()
      app.globalData.serachHistory = []
      this.modal = false
    },
    handleDelete() {
      this.modal = true
    }
  },
  computed: {
    historyList() {
      const app= getApp()
      return app.globalData.serachHistory ? app.globalData.serachHistory : []
    }
  }
}
</script>

<style lang="scss" scoped>
.p-search {
  .header {
    box-sizing: border-box;
    display: flex;
    height: 40px;
    background-color: #C20C0C;
    align-items: center;
    padding-right: 10px;
    padding-bottom: 5px;
    margin-bottom: 20px;
    .header-icon {
      color: #fff;
      width: 40px;
      height: 100%;
      display: flex;
      padding: 0 7px;
      justify-content: center;
      align-items: center;
      i{
        font-size: 30px;
      }
    }

    .header-input {
      display: flex;
      font-size: 16px;
      flex: 1;
      color:  rgba(255,255,255,0.8);
      border-bottom: 1px solid rgba(255,255,255,0.8);
    }

    /deep/ .header-place-holder {
      font-size: 16px;
      color:  rgba(255,255,255,0.5);
    }

  }

  .card {
    padding-left: 10px;
    padding-right: 10px;
    .title {
      font-size: 14px;
      font-weight: bold;
      display: flex;
      padding-bottom: 5px;
      .text {
        flex: 1;
      }
      .icon {
        color: #ccc;
        margin-right: 5px;
      }
    }
    .body {
      padding-bottom: 25px;
      display: flex;
      flex-wrap: wrap;
      .target {
        margin-top: 8px;
        margin-right: 8px;
        display: inline-flex;
        align-items: center;
        padding: 5px 12px;
        border-radius: 100px;
        background-color: #F3F3F3;
        font-size: 14px;
        .hot {
          margin-left: 2px;
          display: inline-flex;
          text-align: center;
          background-color: #C20C0C;
          font-size: 10px;
          border-radius: 2px;
          padding: 2px;
          color: #ffffff;
        }
      }
    }
  }

}
</style>