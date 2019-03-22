<template>
  <div class="p-comment">
    <div class="center">
      <div class="item">
        <div class="header">
          <div class="avatar">
            <img src="http://chara-static-source.oss-cn-shanghai.aliyuncs.com/font/avator.jpg" alt="">
          </div>
          <div class="txt">
            <div class="name">大鹏</div>
            <div class="time">20150210</div>
          </div>
        </div>
        <div class="center">
          <div class="txt">曾经有一份爱摆在我面前</div>
          <div class="action"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAlbumCommentsAPI,getMusicCommentsAPI,getPlaylistCommentsAPI  } from '_a/comment'
import { loginByPhoneAPI } from '_a/login'
import {getLoginStatusAPI} from "@/api/login"
export default {
  name: 'comment',
  data() {
    return {

    }
  },
  mounted() {
    const { id, type } = this.$mp

    switch (type) {
      case 'music': {

      }
      break;
      case 'playlist': {

      }
      break;
      case 'album': {

      }
      break;
    }
  },
  methods:{
    /* fetch
    ------------------------- - */
    fetchMusicComment() {
      try {

      } catch (e) {
        console.warn(e)
      }
    },
    fetchAlbumComment() {
      try {

      } catch (e) {
        console.warn(e)
      }
    },
    fetchPlaylistComment() {
      try {

      } catch (e) {
        console.warn(e)
      }
    }
  },
}
</script>
<style lang="scss" scoped>
  .p-comment {
    .center {
      .item {
        display: flex;
        flex-direction: column;
        .header {
          display: flex;
          .avatar {
            img {
              width: 30px;
              height: 30px;
              border-radius: 50% ;
            }
          }
          .txt {
            padding-left: 10px;
            font-size: 14px;
            .time {
              color: rgba(0,0,0,.5);
            }
          }
        }
        .center {
          .txt {
            font-size: 14px;
          }
        }
      }
    }
  }
</style>