<template>
  <div class="download">
    <!-- <img src="../assets/APP下载页面@2x.png" alt=""> -->
    <div class="btn" @click="downloadApp">
      <!-- 苹果下载 -->
      <button class="ios" v-if="showBtn == 'ios'">
        <img src="../assets/icon_ios@2x.png" alt="">iphone下载
      </button>
      <!-- 安卓下载 -->
      <button class="andrio" v-if="showBtn == 'andriod'" >
        <img src="../assets/icon_andiord@2x.png" alt="">android下载
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showBtn:''
    };
  },
  created(){
    this.appSource()
  },
  methods: {
    appSource() {
      const u = navigator.userAgent,
        app = navigator.appVersion;
      //const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        this.showBtn = 'ios'
      } else {
        this.showBtn = 'andriod'
      }
    },

    downloadApp() {
      const u = navigator.userAgent;
      const isWechart = u.match(/MicroMessenger/i) == "MicroMessenger"
      if(isWechart) {
        this.$toast("请在浏览器打开，进行下载")
      } else {
        if(this.showBtn === "android") {
          window.location.href = "http://www.baidu.com"
        } else {
          window.location.href = "http://www.baidu.com"
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.download {
  height: 100%;
  background-image: url("../assets/APP下载页面@2x.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  img {
    display: block;
    height: 100%;
    width: 100%;
  }
  .btn {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    .ios {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 194px;
      height: 50px;
      border-radius: 25px;
      border: 1px solid rgba(243, 73, 74, 1);
      margin-top: 30px;
      background-color: #fff;
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(243, 73, 74, 1);
      img {
        width: 21px;
        height: 25px;
        margin-right: 11px;
      }
    }
    .andrio {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 194px;
      height: 50px;
      border-radius: 25px;
      border: 1px solid rgba(243, 73, 74, 1);
      margin-top: 30px;
      background-color: #fff;
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(243, 73, 74, 1);
      img {
        width: 21px;
        height: 25px;
        margin-right: 11px;
      }
    }
  }
}
</style>

