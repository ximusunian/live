import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import VideoPlayer from 'vue-video-player'
// import VideoPlayer from 'vue-video-player'
import { Field, CellGroup, Cell, Button } from 'vant';

Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Button)
Vue.use(Field);
// import "videojs-flash"
// require('video.js/dist/video-js.css')

// require('vue-video-player/src/custom-theme.css')

// Vue.use(VideoPlayer)
import "amfe-flexible/index.js"

// import Vant from 'vant'
import 'vant/lib/index.css'
// Vue.use(Vant)
// import Vue from 'vue';
import { Dialog } from 'vant';

import http from '../src/request/http'
import api from '../src/request/api'
// 全局注册
Vue.use(Dialog);

// VideoPlayer.config({
//   youtube: true,
//   switcher: true,
//   hls: true
// })
router.beforeEach((to, from, next) => {  
  //动态设置网页标题
  document.title = to.meta.title ;
  next()
})


// use
// Vue.use(VideoPlayer)
Vue.config.productionTip = false;
import TIM from 'tim-js-sdk';
import COS from "cos-js-sdk-v5";
let options = {
  SDKAppID: 1400407865// 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim = TIM.create(options); // SDK 实例通常用 tim 表示
// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
tim.setLogLevel(1); // 普通级别，日志量较多，接入时建议使用
// tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
// tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
//   console.log(event);
// })
// 注册 COS SDK 插件
tim.registerPlugin({'cos-js-sdk': COS});
// export default tim
Vue.prototype.tim = tim;
Vue.prototype.TIM = TIM;
Vue.prototype.$http = http;
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
