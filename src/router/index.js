import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    meta: { title:"汇童易直播" },
    component: () => import("../views/Home.vue")
  },
  {
    path: "/download",
    name: "Download",
    meta: { title:"注册汇童易" },
    component: () => import("../views/Download.vue")
  },
  {
    path: "/register",
    name: "Register",
    meta: { title:"注册汇童易" },
    component: () => import("../views/Register.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
