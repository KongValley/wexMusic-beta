<template>
  <div class="p-mfs">
    <div class="list-item"
       v-for="item in follows"
       :key="item.userId"
    >
      <div class="left">
        <div class="left-img">
          <img :src="item.avatarUrl" alt="">
        </div>
      </div>
      <div class="right">
        <div class="right-title">{{item.nickname}}</div>
        <div class="right-sub-title">{{item.signature ? item.signature : ''}}</div>
      </div>
      <div class="action">
        <div class="action-btn" @click="handleShowModal(item.userId)">发送私信</div>
      </div>
    </div>
    <i-modal title="发送私信" :visible="visible" @ok="handleClickOk" @cancel="handleClickClose">
      <input class="input-text" v-model="text" placeholder="请输入发送内容"/>
    </i-modal>
    <i-toast id="toast"></i-toast>
    <c-footerbar></c-footerbar>
  </div>
</template>

<script>
import CFooterbar from '_c/footer-bar'
import { getUserFollowsAPI,sendMessageAPI } from '_a/user'
const { $Toast } = require('_v/base/index')
export default {
  name: "my-follows",
  components: {
    CFooterbar
  },
  data() {
    return {
      follows: [],
      visible: false,
      text: '',
      currentId: ''
    }
  },
  async mounted() {
    const res = await this.fetchUserFollows()
    this.follows = res.data.follow
  },
  methods: {
    /* methods
    -------------------------- */
    handleShowModal(id) {
      this.currentId = id
      this.visible = true
    },
    async handleClickOk() {
    console.log(this.text)
      if(this.text.trim().length) {
        await this.fetchSendText()
        $Toast({
          content: '发送成功',
          type: 'success'
        })
        this.visible = false
      }else {
        $Toast({
          content: '内容不能为空',
          type: 'error'
        })
      }
    },
    handleClickClose() {
      this.visible = false
    },
    /* fetch
    -------------------------- */
    async fetchUserFollows() {
      try {
        const params = {
          uid: wx.getStorageSync('uid')
        }
        return await getUserFollowsAPI(params)
      } catch (e) {
        console.warn(e)
      }
    },
    async fetchSendText() {
      try {
        const params = {
          user_ids: this.currentId,
          msg: this.text
        }
        return await sendMessageAPI(params)
      } catch (e) {
        $Toast({
          content: '发送失败',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p-mfs {
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 50px;
  box-sizing: border-box;
  .input-text {
    text-align: left;
    padding: 0 10px;
  }
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
      flex: 1;
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
    .action {
      display: flex;
      align-items: center;
      &-btn {
        font-size: 14px;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        background: linear-gradient(to right,#ED6253,#CD4C43);
        border-radius: 50px;
        box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
      }
    }
  }
}
</style>