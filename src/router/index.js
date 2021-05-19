import Vue from 'vue'
import VueRouter from 'vue-router'
import webapp from 'rnjs-webapp'
import store from '../store/index'
import { isIos } from '@/utils/util'

const { framePage, errorPage, beforeEach, afterEach } = webapp.routes

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    meta: { title: '乐蜂享工作台' },
    component: () => import('../views/Index.vue')
  },
  {
    path: '/user/login',
    name: 'login',
    meta: { title: '乐蜂享' },
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/user/setting',
    name: 'setting',
    meta: { title: '设置' },
    component: () => import('../views/Setting.vue')
  },
  {
    path: '/user/modify/:type/:value',
    name: 'modify',
    meta: { title: '' },
    component: () => import('../views/Modify.vue')
  },
  {
    path: '/user/statistic/list',
    name: 'statisticList',
    meta: { title: '统计列表' },
    component: () => import('../views/StatisticList.vue')
  },
  {
    path: '/user/statistic',
    name: 'statisticDetail',
    meta: { title: '数据统计' },
    component: () => import('../views/StatisticDetail.vue')
  },
  {
    path: '/order/list',
    name: 'orderlist',
    meta: { title: '进件处理' },
    component: () => import('../views/OrderList.vue')
  },
  {
    path: '/order/detail/:sn',
    name: 'orderdetail',
    meta: {
      title: '进件详情'
    },
    component: () => import('../views/OrderDetail.vue')
  },
  {
    path: '/guide',
    name: 'guide',
    meta: {
      title: '乐蜂享'
    },
    component: () => import('../views/Guide.vue')
  }
]

// 获取真实有效微信签名URL
function getWechatSignUrl(to) {
  if (isIos()) {
    return window.location.href.split('#')[0]
  } else {
    // 此处$appHost需要自行处理
    return (location.protocol + '//' + location.host + '/m' + (to.fullPath === '/' ? '' : to.fullPath)).split('#')[0]
  }
}

const router = new VueRouter({
  mode: 'history',
  base: window.VUE_APP_ROUTER_BASE || '/',
  routes: [...framePage, ...routes, ...errorPage]
})
router.beforeEach((to, from, next) => {
  return beforeEach(store, router, to, from, next)
})
router.afterEach((to, from) => {
  // let url = getWechatSignUrl(to)
  // store.commit('home/setWechatSignUrl', url)
  return afterEach(store, router, to, from)
})

export default router
