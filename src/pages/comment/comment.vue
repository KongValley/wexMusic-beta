<template>
  <div class="p-comment">
    <scroll-view
      class="center"
      mp:scroll-y="true"
      @scrolltolower="handleScrollToLoadMore">
      <div class="hot">
        热门评论
      </div>
      <div class="item" v-for="item in hotComments" :key="item.commentId">
        <div class="item-header">
          <div class="avatar">
            <img :src="item.user.avatarUrl" alt="">
          </div>
          <div class="txt">
            <div class="name">{{item.user.nickname}}</div>
            <div class="time">{{handleFormatTime(item.time)}}</div>
          </div>
          <div class="icon" v-if="isShowDelete">
            <i class="material-icons">delete_forever</i>
          </div>
        </div>
        <div class="item-center">
          <div class="txt">{{item.content}}</div>
          <div class="action">
            <div class="count">{{item.likedCount}}</div>
            <div class="icon" @click="handleLikeComment(item)">
              <i class="material-icons" v-if="item.liked">favorite</i>
              <i class="material-icons" v-if="!item.liked">favorite_border</i>
            </div>
          </div>
        </div>
      </div>
      <div class="empty" v-if="total === 0">
        暂无评论
      </div>
      <div class="hot">
      </div>
      <div class="hot">
        最新评论
      </div>
      <div class="item" v-for="item in comments" :key="item.commentId">
        <div class="item-header">
          <div class="avatar">
            <img :src="item.user.avatarUrl" alt="">
          </div>
          <div class="txt">
            <div class="name">{{item.user.nickname}}</div>
            <div class="time">{{handleFormatTime(item.time)}}</div>
          </div>
          <div class="icon" @click="handleDeleteComment(item.commentId)">
            <i class="material-icons" v-if="uid.toString() === item.user.userId.toString()">delete_forever</i>
          </div>
        </div>
        <div class="item-center">
          <div class="txt">{{item.content}}</div>
          <div class="action">
            <div class="count">{{item.likedCount}}</div>
            <div class="icon" @click="handleLikeComment(item)">
              <i class="material-icons" v-if="item.liked">favorite</i>
              <i class="material-icons" v-if="!item.liked">favorite_border</i>
            </div>
          </div>
        </div>
      </div>
      <div class="empty" v-if="total === 0">
        暂无评论
      </div>
      <div v-if="comments.length < total">
        <i-load-more></i-load-more>
      </div>
      <div v-if="comments.length === total && total > 0">
        <i-divider color="#DF4337" lineColor="#DF4337">我是有底线的 :)</i-divider>
      </div>
    </scroll-view>
    <div class="footer-post">
      <div class="input">
        <input type="text" v-model="message" placeholder="写点什么吧~~">
      </div>
      <div class="icon" @click="handleSendComment">
        <i class="material-icons">send</i>
      </div>
    </div>
    <div class="footer-refresh" @click="handleRefreshComment">
      <i class="material-icons">refresh</i>
    </div>
    <c-footerbar></c-footerbar>
    <i-message id="message"></i-message>
    <i-modal title="删除确认" :visible="deleteModalVisible" :mp:actions="deleteModalActon" @clickhook="handleModalClick">
      <view>删除后无法恢复哦</view>
    </i-modal>
  </div>
</template>

<script>
import {
  getAlbumCommentsAPI,
  getMusicCommentsAPI,
  getPlaylistCommentsAPI,
  likeCommentAPI,
  sendCommentsAPI,
  deleteCommentsAPI
} from '_a/comment'
import {
  formatTime
} from '_u'

const { $Message } = require('_v/base/index')

import { typeList } from './var'
import CFooterbar from '_c/footer-bar'
export default {
  name: 'comment',
  components: {
    CFooterbar
  },
  data() {
    return {
      uid: '',
      id: '',
      type: '',
      offset: 0,
      hotComments: [],
      comments: [],
      total: 0,
      message: '',
      currentCommentId: '',
      deleteModalVisible: false,
      deleteModalActon: [
        {
          name: '取消'
        },
        {
          name: '删除',
          color: '#ed3f14',
          loading: false
        }
      ]
    }
  },
  async mounted() {
    let { id, type } = this.$mp.options
    this.id = id
    this.type = type
    console.log(id,type)
    await this.handleLoadMoreComments()
  },
  beforeDestroy() {
    /* reset data
    -------------------------- */
    this.id = ''
    this.type = ''
    this.comments = []
    this.hotComments = []
    this.offset = 0
  },
  methods:{
    /* methods
    -------------------------- */
    initComments () {
      this.hotComments = []
      this.comments = []
      this.offset = 0
    },
    loadComments(data) {
      if (this.offset === 0)
        this.hotComments.push(...data.hotComments)
      this.comments.push(...data.comments)
      this.total = data.total
      this.uid = data.userId
      this.offset = this.offset + 1
    },
    async handleLikeComment(item) {
      const res = await this.fetchLikeComment(item)
      if (res.data.code === 200) {
        item.liked = !item.liked
        if(item.liked) {
          $Message({
            content: '点赞成功',
            type: 'success'
          });
          item.likedCount = item.likedCount + 1
        }else {
          $Message({
            content: '取消成功',
            type: 'success'
          });
          item.likedCount = item.likedCount - 1
        }
      } else {
        $Message({
          content: '电磁波暂时无法到达',
          type: 'error'
        });
      }
    },
    async handleSendComment() {
      if(this.message) {
        await this.fetchSendComment()
        this.message = ''
        $Message({
          content: '发送成功',
          type: 'success'
        })
        await this.handleRefreshComment()
      }
      else
        $Message({
          content: '写点什么再发送吧',
          type: 'error'
        })
    },
    handleDeleteComment(commentId) {
      this.deleteModalVisible = true
      this.currentCommentId = commentId
    },
    async handleRefreshComment() {
      this.initComments()
      await this.handleLoadMoreComments()
      $Message({
        content: '数据更新成功',
        type: 'success'
      });
    },
    async handleModalClick({detail}) {
      if(detail) {
        const index = detail.index
        console.log(index)
        switch (index) {
          case 0: {
            this.deleteModalVisible = false
          }
          break;

          case 1: {
            const res = await this.fetchDeleteComment(this.currentCommentId)
            $Message({
              content: '删除成功',
              type: 'success'
            })
            await this.handleRefreshComment()
            this.deleteModalVisible = false
          }
          break;
        }
      }
    },
    handleFormatTime(val) {
      const date = new Date(val)
      return formatTime(date)
    },
    async handleScrollToLoadMore () {
      await this.handleLoadMoreComments()
    },
    async handleLoadMoreComments() {
      switch (this.type) {
        case 'music': {
          const res = await this.fetchMusicComment()
          this.loadComments(res.data)
        }
          break;
        case 'playlist': {
          const res = await this.fetchPlaylistComment()
          this.loadComments(res.data)
        }
          break;
        case 'album': {
          const res= await this.fetchAlbumComment()
          this.loadComments(res.data)
        }
          break;
      }
    },
    /* fetch
    ------------------------- - */
    async fetchSendComment() {
      try {
        const params = {
          type: typeList[this.type],
          id: this.id,
          content: this.message
        }
        return await sendCommentsAPI(params)
      } catch (e) {
        $Message({
          content: e.response.data.msg,
          type: 'error'
        })
        console.warn(e)
      }
    },
    async fetchDeleteComment(commentId) {
      try {
        const params = {
          type: typeList[this.type],
          id: this.id,
          commentId: commentId
        }
        return await deleteCommentsAPI(params)
      } catch (e) {
        $Message({
          content: e.response.data.msg,
          type: 'error'
        })
        console.warn(e)
      }
    },
    async fetchMusicComment() {
      try {
        const params = {
          id: this.id,
          offset: this.offset * 20,
          timestamp: new Date().getTime()
        }
        console.log('param', this.offset, 20)
        return await getMusicCommentsAPI(params)
      } catch (e) {
        console.warn(e)
      }
    },
    async fetchAlbumComment() {
      try {
        const params = {
          id: this.id,
          offset: this.offset * 20,
          timestamp: new Date().getTime()
        }
        return await getAlbumCommentsAPI(params)
      } catch (e) {
        console.warn(e)
      }
    },
    async fetchPlaylistComment() {
      try {
        const params = {
          id: this.id,
          offset: this.offset * 20,
          timestamp: new Date().getTime()
        }
        return await getPlaylistCommentsAPI(params)
      } catch (e) {
        console.warn(e)
      }
    },
    async fetchLikeComment(val) {
      try {
        const params = {
          id: this.id,
          cid: val.commentId,
          t: val.liked ? 0 : 1,
          type: typeList[this.type]
        }
        return await likeCommentAPI(params)
      } catch (e) {
        console.warn(e)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  .p-comment {
    .center {
      ::-webkit-scrollbar {
        width: 4px;
        height: 6px;
        color: transparent;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #DF4337;
      }
      height: 100vh;
      box-sizing: border-box;
      padding-bottom: 90px;
      .empty {
        font-size: 16px;
        text-align: center;
        color: rgba(0, 0, 0, .5);
      }
      .hot {
        width: 100%;
        box-sizing: border-box;
        padding-top: 10px;
        padding-left: 20px;
        padding-bottom: 10px;
        color: #DF4337;
        font-size: 18px;
      }

      .item {
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 10px 20px;

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
        .item-header {
          display: flex;
          .avatar {
            img {
              width: 30px;
              height: 30px;
              border-radius: 50% ;
            }
          }
          .txt {
            flex: 1;
            padding-left: 10px;
            font-size: 14px;
            .time {
              color: rgba(0,0,0,.5);
              font-size: 12px;
            }
          }
          .icon {
            color: #DF4337;
            font-size: 16px;
          }
        }
        .item-center {
          .txt {
            font-size: 14px;
            text-align: justify;
          }
          .action {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            padding-top: 5px;
            .icon {
              color: #DF4337;
              padding: 5px;
              i {
                font-size: 18px;
              }
            }
            .count {
              font-size: 14px;
            }
          }
        }
      }
    }
    .footer-post {
      box-sizing: border-box;
      width: 100%;
      height: 40px;
      position: fixed;
      display: flex;
      align-items: center;
      bottom: 50px;
      padding: 10px 10px;
      left: 0;
      background-color: #ffffff;
      box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
      .input {
        flex: 1;
        font-size: 14px;
      }
      .icon {
        padding-left: 10px;
        color: #DF4337;
      }
    }
    .footer-refresh {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      bottom: 100px;
      right: 10px;
      color: #ffffff;
      background-color: #DF4337;
      box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);

      i {
        font-size: 30px;
      }
    }
  }
</style>