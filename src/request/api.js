import {get, post, put, deleteAxios } from './http'
const api = {
  // 获取用户sig
  getUserSig: "/live/room/im/sig",
  // 获取直播间信息
  // liveDetail: "/live/weburl/detail",
  liveDetail: "/live/weburl/detail",
  // 点赞
  giveLike: "/live/add/like",
  // 增加观看人数
  watcher: "/live/add/watch",
  // 发送验证码
  sendSmsCode: "/v3/app/login/send/sms",
  // 注册
  register: "/v3/app/login/register"
  
}

const getUserSig = (params) => {
  return get(api.getUserSig, params)
}

const getLiveDetail = (params) => {
  return get(api.liveDetail, params)
}

const giveLike = (params) => {
  return post(api.giveLike, params)
}

const addWatcher = (params) => {
  return post(api.watcher, params)
}

const sendSmsCode = (params) => {
  return post(api.sendSmsCode, params)
}

const register = (params) => {
  return post(api.register, params)
}

export default {
  getUserSig,
  getLiveDetail,
  giveLike,
  addWatcher,
  sendSmsCode,
  register,
}