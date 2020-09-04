<template>
  <div class="register">
    <div class="logo">
      <img src="https://huitongyi-mall.oss-cn-hangzhou.aliyuncs.com/h5/assets/logo@2x.png" alt />
    </div>
    <div class="desc">
      <div class="top">工厂最新款拼团</div>
      <div class="bottom">
        真正实现实体店
        <span>"0库存"</span>
      </div>
    </div>
    <div class="form">
      <div style="margin-bottom:35px;">
        <van-field :formatter="trim" v-model="tel" type="tel" placeholder="请输入手机号" />
      </div>
      <div style="margin-bottom:35px;">
        <van-field :formatter="trim" v-model="validCode" center clearable placeholder="请输入验证码">
          <template #button>
            <van-button
              :disabled="!(tel.length === 11) || !verification"
              size="small"
              color="#F72A4E"
              @click="sendMsg"
              round
              plain
              type="default"
            >{{code_btn_txt}}</van-button>
          </template>
        </van-field>
      </div>
      <div>
        <van-field readonly v-model="inviteToken" placeholder="请输入邀请码" />
      </div>
      <div style="margin-top:100px;">
        <van-button
          round
          type="info"
          :disabled="getStatus()"
          color="#FF3838"
          @click="goDownload"
          block
        >确定注册</van-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Register",
  data() {
    return {
      tel: "",
      validCode: "",
      inviteToken: localStorage.getItem('inviteToken') || "",
      time: 60,
      code_btn_txt: "获取验证码",
      verification: true
    };
  },
  methods: {
    // 去除输入框中空格
    trim(value) {
      return value.replace(/\s+/g, "");
    },

    sendMsg() {
      let phone_reg = /^1[3456789]\d{9}$/;
      if (phone_reg.test(this.tel)) {
        let params = new FormData();
        params.append("phone", this.tel);
        params.append("smsType", 1);
        this.$api.sendSmsCode(params).then(res => {
          if (res.result === 100) {
            this.setCodeTime();
            this.$toast("验证码发送成功");
          }
        });
      } else {
        this.$toast("请输入正确的手机号");
      }
    },

    // 验证码倒计时
    setCodeTime() {
      if (this.time === 1) {
        this.time = 60;
        this.code_btn_txt = "获取验证码";
        this.verification = true;
      } else {
        this.time -= 1;
        this.code_btn_txt = this.time.toString() + "S";
        this.verification = false;
        this.timer = setTimeout(
          function() {
            this.setCodeTime();
          }.bind(this),
          1000
        );
      }
    },

    getStatus() {
      if (this.tel === "" || this.validCode === "") {
        return true;
      } else {
        return false;
      }
    },

    // todo:添加节流
    goDownload() {
      // 向后台请求数据
      let params = new FormData()
      params.append("inviteToken", this.inviteToken)
      params.append("phone", this.tel)
      params.append("smsCode", this.validCode)
      this.$api.register(params).then(res => {
        if(res.result === 100) {
          localStorage.setItem("token", res.data.token)
          this.$router.push("/download");
        } else {
          this.$toast(res.message)
        }
      })
    },
  }
};
</script>
<style>
.van-cell {
  border-bottom: 1px solid #ccc;
  padding: 6px 0;
  font-size: 18px;
}
</style>

<style lang="scss" scoped>
.register {
  padding: 0 28px;
  box-sizing: border-box;
  overflow: hidden;
  .logo {
    margin: 60px 0 20px 0;
    width: 88px;
    height: 28px;
    img {
      display: block;
      width: 88px;
      height: 28px;
    }
  }
  .desc {
    .top {
      width: 126px;
      height: 25px;
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 25px;
    }
    .bottom {
      height: 25px;
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 25px;
      margin-bottom: 45px;
      span {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
}
</style>
