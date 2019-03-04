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
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleSearch"
        >
      <div class="header-clear">
        <i class="material-icons" @click="handleClear">close</i>
      </div>
      <div class="header-search-suggest" v-if="searchSuggest && isFocus">
        <div class="item first">
          <div>搜索"{{search}}"</div>
        </div>
        <div class="item" v-for="item in searchSuggest" :key="item.keyword" @click="handleClickKeyword(item.keyword)">
          <i class="material-icons icon">search</i>
          <div>{{item.keyword}}</div>
        </div>
      </div>
    </div>
    <div class="card" v-if="searchHotList">
      <div class="title">
        热门搜索
      </div>
      <div class="body">
        <div class="target" @click="handleClickKeyword(item.first)" v-for="(item,index) in searchHotList" :key="item.first">
          {{item.first}}
          <div class="hot" v-if="index === 0">热</div>
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
      <div class="body">
        <div class="target" @click="handleClickKeyword(item)" v-for="(item,index) in historyList" :key="item">
          {{item}}
        </div>
      </div>
    </div>
    <i-modal :visible="modal" @ok="handleOk" @cancel="handleCancel">
      <div>确定清空全部历史纪录？</div>
    </i-modal>
  </div>
</template>
<script>
import { throttle } from '_u'
import { getSearchHotDataAPI,getSearchSuggestAPI } from '_a/search'
export default {
  name: "p-search",
  data() {
    return {
      search: "",
      modal: false,
      searchHotList: null,
      searchSuggest: null,
      searchResult: null,
      isFocus: false
    }
  },
  methods: {
    handleSearch() {
      // MARK 存放搜索记录
      const app= getApp()
      if(!app.globalData.serachHistory) {
        app.globalData.serachHistory = []
      }
      if(this.search.length) {
        if(!app.globalData.serachHistory.includes(this.search))
          app.globalData.serachHistory.unshift(this.search)
      }

      wx.navigateTo({
        url: '../search-detail/index?search='+this.search
      })
    },
    handleToHome() {
      // MARK 返回上一页
      wx.redirectTo({
        url: '../home/index'
      })
    },
    handleCancel() {
      // MARK 点击取消的回调
      this.modal = false
    },
    handleOk() {
      // MARK 点击确认的回调
      const app= getApp()
      app.globalData.serachHistory = []
      this.modal = false
    },
    handleDelete() {
      // MARK 点击删除历史记录事件
      this.modal = true
    },
    async fetchSearchHot() {
      try {
        const res = await getSearchHotDataAPI()
        if(res.data.code === 200) {
          this.searchHotList = res.data.result.hots
        }
      }catch (e) {
        console.log(e)
      }
    },
    handleClear() {
      this.search = ""
      this.searchSuggest = null
    },
    async fetchSearchSuggest() {
      if(!this.search)
        return
      try {
        let params = {
          keywords: this.search
        }
        // MARK 获取搜索建议
        const res = await getSearchSuggestAPI(params)
        if(res.data.code === 200) {
          this.searchSuggest = res.data.result['allMatch']
        }
      } catch (e) {
        console.log(e)
      }
    },
    // MARK 使用函数防抖，避免频繁请求
    handleInput: throttle(async function () {
      await this.fetchSearchSuggest()
    }),
    handleFocus() {
      this.isFocus = true
    },
    handleBlur() {
      this.isFocus = false
    },
    handleClickKeyword(val) {
      this.search = val

    }
  },
  computed: {
    historyList() {
      const app= getApp()
      return app.globalData.serachHistory ? app.globalData.serachHistory : []
    }
  },
  async mounted() {
    // await this.fetchSearchHot()
  }
}
</script>

<style lang="scss" scoped>
.p-search {
  .header {
    box-sizing: border-box;
    position: relative;
    display: flex;
    height: 40px;
    background-color: #DF4337;
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

    .header-clear {
      color: #fff;
      position: absolute;
      top: 45%;
      right: 5px;
      transform: translateY(-50%);
    }

    .header-input {
      box-sizing: border-box;
      padding-right: 30px;
      display: flex;
      font-size: 16px;
      flex: 1;
      color:  rgba(255,255,255,0.8);
      height: 90%;
      border-bottom: 1px solid rgba(255,255,255,0.8);
    }

    .header-search-suggest {
      position: absolute;
      top: 42px;
      left: 15px;
      width: calc(100% - 25px);
      height: auto;
      background-color: rgb(243,243,243);
      box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);

      .item {
        font-size: 14px;
        width: 100%;
        box-sizing: border-box;
        height: 40px;
        display: flex;
        padding: 10px 10px;
        color: rgba(0,0,0,0.5);
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, .1);

        .icon {
          color:rgba(0,0,0,0.2);
          padding-right: 10px;
        }
      }
      .item.first {
        color: #6188B5;
      }

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
          background-color: #DF4337;
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