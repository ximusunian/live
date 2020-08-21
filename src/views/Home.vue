<template>
  <div id="home">
    <div class="live_header">
      <div class="head_left">
        <img :src="shopHeadImg" class="live_logo" />
        <div class="live_info">
          <span>{{shopName}}</span>
          <span>{{watchNum}}人观看</span>
        </div>
      </div>
      <div class="head_right">汇童易</div>
    </div>
    <div id="id_test_video" style="width:100%; height:100%;"></div>
    <barrage :barrage="barrageTxt"></barrage>
    <div class="input_cate">
      <span class="img" @click="goRegisterPage">{{productNum}}</span>
      <van-field
        :formatter="trim"
        v-model="barrage"
        type="text"
        placeholder="跟主播聊点什么吧"
        @blur="sendTxt"
      />
      <div class="heart">
        <span class="likeNo">{{likeNo}}</span>
        <img src="../assets/give_like.png" class="heart_icon" @click="giveLike" />
      </div>
    </div>
  </div>
</template>

<script>
import barrage from "./barrage";
import head_img_default from "../assets/live_head_default.png";
import live_placeholder_bg from "../assets/live_placeholder_bg.png";
import generateRandomId from "../utils/generateRandomId";
export default {
  name: "Home",
  components: {
    barrage
  },
  data() {
    return {
      url: this.$route.query.playUrl,
      userId: "",
      userSig: "",
      shopName: "",
      shopHeadImg: head_img_default,
      likeNo: 0,
      watchNum: 0,
      groupID: "",
      productNum: "",
      barrage: "",
      barrageTxt: {} // 发送及接受的消息信息
    };
  },
  created() {
    let inviteToken = this.$route.query.inviteToken;
    localStorage.setItem("inviteToken", inviteToken);
    this.init();
  },

  mounted() {
    if (this.url === undefined || this.url === null || this.url === "") {
      this.$toast("缺少直播间地址");
    } else {
      this.openLive();
    }
    document.body.addEventListener('mousedown', function(){
        var vdo = document.getElementsByTagName("video")[0];
        vdo.muted = false;
    }, false); 
  },
  methods: {
    // 工具性函数区--------------------------------------------------------------
    // 去除输入框中空格
    trim(value) {
      return value.replace(/\s+/g, "");
    },
    // --------------------------------------------------------------------------

    // IM回调处理函数区-----------------------------------------------------------
    // 发送消息
    _handleTextMsg(message) {
      this.barrageTxt = {
        nick: message.nick,
        text: message.payload.text,
        time: message.time
      };
    },

    _handleCustomMsg(message) {
      console.log(message.payload);
    },

    _handleGroupTip(message) {
      // 详细数据结构请参考 GroupTipPayload 接口的说明
      switch (message.payload.operationType) {
        case TIM.TYPES.GRP_TIP_MBR_JOIN: // 有成员加群
          break;
        case TIM.TYPES.GRP_TIP_MBR_QUIT: // 有群成员退群
          break;
        case TIM.TYPES.GRP_TIP_MBR_KICKED_OUT: // 有群成员被踢出群
          break;
        case TIM.TYPES.GRP_TIP_MBR_SET_ADMIN: // 有群成员被设为管理员
          break;
        case TIM.TYPES.GRP_TIP_MBR_CANCELED_ADMIN: // 有群成员被撤销管理员
          break;
        case TIM.TYPES.GRP_TIP_GRP_PROFILE_UPDATED: // 群组资料变更
          //从v2.6.0起支持群组自定义字段变更内容
          // message.payload.newGroupProfile.groupCustomField
          break;
        case TIM.TYPES.GRP_TIP_MBR_PROFILE_UPDATED: // 群成员资料变更，例如群成员被禁言
          break;
        default:
          break;
      }
    },

    // 系统消息
    _handleGroupSystemNotice(message) {
      let data = JSON.parse(message.payload.userDefinedField);
      // type: 3 -> 进入直播；5 -> 点赞；6 -> 观看人数
      if (data.type === 3) {
        this.barrageTxt = {
          nick: "",
          text: data.message,
          time: message.time
        };
      } else if (data.type === 5) {
        this.likeNo = data.message;
      } else if (data.type === 6) {
        this.watchNum = data.message;
      }
    },
    //-----------------------------------------------------------------------------------

    //自定义功能函数区--------------------------------------------------------------------
    // 初始化项目
    init() {
      this.getUserSig();
      if (this.url === undefined || this.url === null || this.url === "") {
        this.$toast("缺少直播间地址");
      } else {
        this.getLiveDetail(this.url);
      }
    },

    // 初始化直播间，并挂载消息监听
    openLive() {
      let liveUrl = this.url;
      var player = new TcPlayer("id_test_video", {
        m3u8: liveUrl, //请替换成实际可用的播放地址
        autoplay: true, //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
        live: true,
        flash: false,
        controls: "none",
        poster: live_placeholder_bg,
      });
      player.mute(true);

      let _this = this;
      // IM消息监听
      this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, function(event) {
        // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
        const length = event.data.length;
        let message;
        for (let i = 0; i < length; i++) {
          message = event.data[i];
          switch (message.type) {
            case _this.TIM.TYPES.MSG_TEXT:
              // 收到了文本消息
              _this._handleTextMsg(message);
              break;
            case _this.TIM.TYPES.MSG_CUSTOM:
              // 收到了自定义消息
              _this._handleCustomMsg(message);
              break;
            case _this.TIM.TYPES.MSG_GRP_TIP:
              // 收到了群提示消息，如成员进群、群成员退群
              //note:经过试验，群提示消息不走这一条,走MSG_GRP_SYS_NOTICE
              _this._handleGroupTip(message);
              break;
            case _this.TIM.TYPES.MSG_GRP_SYS_NOTICE:
              // 收到了群系统通知，通过 REST API 在群组中发送的系统通知请参考 在群组中发送系统通知 API
              _this._handleGroupSystemNotice(message);
              break;
            default:
              break;
          }
        }
      });
    },

    // 获取用户sig
    getUserSig() {
      // 生成随机userId
      let userId = generateRandomId();
      this.$api.getUserSig({ userId: userId }).then(res => {
        if (res.result === 100) {
          this.login(userId, res.data);
        }
      });
    },

    // IM登录
    login(userId, userSig) {
      this.tim.login({
        userID: String(userId),
        userSig: userSig
      });
    },

    // 获取直播详情
    getLiveDetail(url) {
      let token = localStorage.getItem("token") || "";
      this.$api
        .getLiveDetail({ webUrl: url, token: token })
        .then(res => {
          if (res.result === 100) {
            this.likeNo = res.data.likeNum;
            this.watchNum = res.data.watchNum;
            this.shopName = res.data.shopName;
            this.shopHeadImg = res.data.shopHeadImg;
            this.groupID = res.data.imGroupId;
            this.productNum = res.data.productNum;
            localStorage.setItem("playNo", res.data.playNo);
          } else {
            this.$toast(res.message);
          }
        })
        .then(() => {
          this.joinGroup();
        });
    },

    // 加入群组
    joinGroup() {
      let groupID = this.groupID;
      let promise = this.tim.joinGroup({
        groupID: groupID,
        type: this.TIM.TYPES.GRP_AVCHATROOM
      });
      let _this = this;
      promise
        .then(function(imResponse) {
          switch (imResponse.data.status) {
            case _this.TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
              break;
            case _this.TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
              _this.addWatcher();
              break;
            case _this.TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
              break;
            default:
              break;
          }
        })
        .catch(function(imError) {
          console.warn("joinGroup error:", imError); // 申请加群失败的相关信息
        });
    },

    // 初始化消息列表
    initialize(msg) {
      let groupID = this.groupID;
      let message = this.tim.createTextMessage({
        to: groupID,
        conversationType: this.TIM.TYPES.CONV_GROUP,
        payload: {
          text: msg
        }
      });
      this.sendMessages(message);
    },

    // 发送消息
    sendMessages(message) {
      // 2. 发送消息
      let promise = this.tim.sendMessage(message);
      let _this = this;
      promise
        .then(function(imResponse) {
          // 发送成功
          console.log(imResponse);
          _this.barrageTxt = {
            nick: "我",
            text: imResponse.data.message.payload.text,
            time: imResponse.data.message.time
          };
          // _this.barrageList.push(imResponse.data.message.payload.text)
        })
        .catch(function(imError) {
          // 发送失败
          console.warn("sendMessage error:", imError);
        });
    },

    // 用户发送消息
    sendTxt() {
      if (this.barrage !== "") {
        this.initialize(this.barrage.slice(0, 24));
      }
    },

    // 增加直播间人数
    addWatcher() {
      let playNo = localStorage.getItem("playNo");
      let token = localStorage.getItem("token") || "";
      let params = new FormData();
      params.append("playNo", playNo), params.append("token", token);
      this.$api.addWatcher(params).then(res => {
        if (res.result === 100) {
        } else {
          this.$toast(res.message);
        }
      });
    },

    // 点赞
    giveLike() {
      let token = localStorage.getItem("token") || "";
      let playNo = localStorage.getItem("playNo");
      let params = new FormData();
      params.append("playNo", playNo);
      params.append("token", token);
      this.$api.giveLike(params);
    },

    //跳转注册页面
    goRegisterPage() {
      this.$dialog
        .confirm({
          title: "",
          message: "网页直播暂不支持购买!\n可下载APP购买"
        })
        .then(() => {
          // on confirm
          this.$router.push("/register");
        })
        .catch(() => {
          // on cancel
        });
    }
    //------------------------------------------------------------------------------
  }
};
</script>
<style lang="scss" scoped>
#home {
  height: 100%;
  overflow: hidden;
  position: relative;
  .van-cell {
    width: 60%;
    background-color: transparent;
    padding: 0;
  }
  .van-cell::after {
    left: 0;
  }
  video {
    height: 100vh !important;
    width: auto !important;
  }
  .live_header {
    width: 100%;
    height: 35px;
    position: absolute;
    top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    z-index: 10;
    .head_left {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 15px;
      .live_logo {
        width: 35px;
        height: 35px;
        border-radius: 35px;
        margin-right: 5px;
      }
      .live_info {
        font-size: 14px;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        span:first-child {
          height: 14px;
        }
        span:not(:first-child) {
          margin-top: 5px;
        }
      }
    }
    .head_right {
      width: 70px;
      height: 35px;
      margin-right: 15px;
      border-radius: 8px;
      text-align: center;
      line-height: 35px;
      font-size: 16px;
      color: #ffffff;
      background-color: rgba(235, 5, 24, 1);
    }
  }
  .vjs-custom-skin {
    .video-js {
      height: 100vh;
      object-fit: cover;
    }
    #vjs_video_3 {
      height: 100vh !important;
      object-fit: cover;
    }
    .vjs_video_3-dimensions {
      height: 100vh !important;
      object-fit: cover;
    }
  }
  .input_cate {
    width: 100%;
    position: absolute;
    bottom: 30px;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    background-color: transparent;
    .img {
      height: 35px;
      width: 27px;
      font-size: 13px;
      text-align: center;
      line-height: 50px;
      color: #ffffff;
      background-image: url("../assets/shop_store.png");
      background-size: 100% 100%;
    }
    .heart {
      display: flex;
      flex-direction: column;
      align-items: center;
      .likeNo {
        padding: 0 10px;
        height: 18px;
        border-radius: 18px;
        text-align: center;
        line-height: 18px;
        font-size: 14px;
        color: #ffffff;
        background-color: red;
      }
      .heart_icon {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        margin-top: 10px;
      }
    }
  }
}
</style>

