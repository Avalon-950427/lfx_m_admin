import Vue from 'vue'
import 'amfe-flexible'
import webapp from 'rnjs-webapp'
import 'rnjs-webapp/lib/webapp.css'
// vuex和路由
import router from './router'
import store from './store'
// 公共样式
import './assets/css/public.less'
// 注册全局组件及函数
import components from './components'
import App from './app.vue'

Vue.config.productionTip = false
Vue.config.ignoredElements = ['wx-open-launch-weapp', 'wx-open-launch-app']

Vue.use(webapp)
Vue.use(components)

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    webapp.onVueCreated(this)
    store.dispatch('system/customize/update', window.VUE_CUSTOMIZE || {})
    // window.addEventListener('resize', remLayout, false)
  },
  mounted() {
    webapp.onVueMounted(this)
  }
}).$mount('#app')
