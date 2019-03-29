<template>
  <div class="p-my-music">
    <div class="p-my-music-top">
      <div class="top-account">
        <div class="account-avatar">
          <img :src="userInfo.avatarUrl" alt="">
        </div>
        <div class="account-right">
          <div class="account-name">{{userInfo.nickname}}</div>
          <div class="account-action">退出登录</div>
        </div>
      </div>
    </div>
    <div class="p-my-music-center">
      <div class="p-music-recently">
        <div class="item" @click="handleToPlayRecently">
          最近播放
        </div>
        <div class="item" @click="handleToMyDj">
          我的电台
        </div>
        <div class="item" @click="handleToMyFollows">
          我的关注
        </div>
        <div class="item" @click="handleToMyArtist">
          收藏的歌手
        </div>
      </div>
      <div class="p-my-music-divider"></div>
      <div class="p-music-playlist">
        <i-collapse :mp:name="currentCollapse" i-class="list-hook">
          <i-collapse-item title="创建的歌单" name="创建的歌单" i-class-title="list-title" i-class-content="list-cnt">
            <div slot="content">
              <div class="list-item"
                v-for="item in createdPlaylist"
                :key="item.id"
                @click="handleToPlaylistDetail(item.id)">
                <div class="left">
                  <div class="left-img">
                    <img :src="item.coverImgUrl" alt="">
                  </div>
                </div>
                <div class="right">
                  <div class="right-title">{{item.name}}</div>
                  <div class="right-sub-title">{{item.trackCount+'首'}}</div>
                </div>
              </div>
            </div>
          </i-collapse-item>
          <i-collapse-item title="收藏的歌单" name="收藏的歌单" i-class-title="list-title" i-class-content="list-cnt">
            <div slot="content">
             <div class="list-item"
              v-for="item in subPlaylist"
              :key="item.id"
              @click="handleToPlaylistDetail(item.id)">
               <div class="left">
                 <div class="left-img">
                   <img :src="item.coverImgUrl" alt="">
                 </div>
               </div>
               <div class="right">
                 <div class="right-title">{{item.name}}</div>
                 <div class="right-sub-title">{{item.trackCount+'首 by '+item.creator.nickname}}</div>
               </div>
             </div>
            </div>
          </i-collapse-item>
        </i-collapse>
      </div>
    </div>
    <c-footerbar></c-footerbar>
  </div>
</template>

<script>
import CFooterbar from '_c/footer-bar'
import {
  getLoginStatusAPI
} from '_a/login'
import {
  getUserSubcountAPI,
  getUserPlaylistAPI
} from '_a/user'
  export default {
    name: "my-music",
    components: {
      CFooterbar
    },
    data() {
      return {
        currentCollapse: '创建的歌单',
        userInfo: {
          avatarUrl: '',
          nickname: '',
          userId: '',
        },
        createdPlaylist: [],
        subPlaylist: []
      }
    },
    mounted() {
      this.initUserInfo()
    },
    methods: {
      /* methods
      -------------------------- */
      async initUserInfo() {
        const res = await this.fetchLoginStatus()
        const playlistRes = await this.fetchUserPlaylist()
        this.userInfo.avatarUrl = res.data.profile.avatarUrl
        this.userInfo.userId = res.data.profile.userId
        this.userInfo.nickname = res.data.profile.nickname

        this.createdPlaylist = playlistRes.data.playlist.filter(val => val.subscribed === false)
        this.subPlaylist = playlistRes.data.playlist.filter(val => val.subscribed === true)
      },
      /* router
      -------------------------- */
      handleToPlaylistDetail(id) {
        wx.navigateTo({
          url: '../playlist-detail/index?playlistId='+id
        })
      },
      handleToPlayRecently() {
        wx.navigateTo({
          url: '../play-recently/index'
        })
      },
      handleToMyFollows() {
        wx.navigateTo({
          url: '../my-follows/index'
        })
      },
      handleToMyArtist() {
        wx.navigateTo({
          url: '../my-artist/index'
        })
      },
      handleToMyDj() {
        wx.navigateTo({
          url: '../my-dj/index'
        })
      },
      /* fetch
      -------------------------- */
      async fetchLoginStatus() {
        try {
          return await getLoginStatusAPI()
        } catch (e) {
          console.warn(e)
        }
      },
      async fetchUserPlaylist() {
        try {
          const uid = wx.getStorageSync('uid')
          const params ={
            uid: uid
          }
          return await getUserPlaylistAPI(params)
        } catch (e) {
          console.warn(e)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.p-my-music {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 50px;
  ::-webkit-scrollbar {
    width: 4px;
    height: 6px;
    color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #DF4337;
  }
  &-divider {
    height: 10px;
  }
  &-top {
    position: relative;
    .top-account {
      display: flex;
      padding: 10px 0;
      .account-avatar {
        padding: 0 10px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }
      .account-right {
        flex: 1;
        display: flex;
        align-items: center;
        padding-right: 10px;
        .account-name {
          flex: 1;
          font-size: 16px;
          color: rgba(0, 0, 0, .4);
        }
        .account-action {
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
  }
  &-center {
    .p-music-recently {
      .item {
        position: relative;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        padding-left: 20px;
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
      }
    }
    .p-music-playlist {
      /deep/ .list-title {
        font-size: 16px;
      }
      /deep/ .list-cnt {
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
            flex-direction: column;
            justify-content: center;
            &-title {
              font-size: 16px;
            }
            &-sub-title {
              font-size: 14px;
              color: rgba(0, 0, 0, .3);
            }
          }
        }
      }
    }
  }
}
</style>