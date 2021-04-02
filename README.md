# rnjs-webapp

> 移动网页(m)端基础框架

## 安装依赖

yarn add rnjs-webapp axios vant amfe-flexible
yarn add --dev ts-import-plugin postcss-pxtorem compression-webpack-plugin babel-plugin-import
yarn add --dev lodash-webpack-plugin babel-plugin-lodash

## 使用方法(main.ts)

```
import Vue from 'vue'
import 'amfe-flexible'
import webapp from 'rnjs-webapp'
// vuex和路由
import router from './router'
import store from './store'
// 公共样式
import './assets/css/public.less'
// 注册全局组件及函数
import components from './components'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(webapp)
Vue.use(components)

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    webapp.onVueCreated(this)
    store.dispatch('system/customize/update', (window as any).VUE_CUSTOMIZE || {})
  },
  mounted () {
    webapp.onVueMounted(this)
  }
}).$mount('#app')
```

## 列表自定义

```
configs.listRenderName = 'RListGrid'
configs.listRenderProps = {
    gridProps: {
      columnNum: 2,
      iconSize: 50,
      gutter: 0,
      border: true,
      center: true,
      square: false,
      clickable: true,
      direction: 'vertical',
      style: 'padding-top:10px;'
    },
    itemProps: {
      // iconPrefix: 'fa',
      icon: 'search',
      badge: '@id',
      text: '@nickname',
      url: '/m/team?id=#{id}',
      replace: true
    },
    // itemRender: 'VanButton',
    // itemRenderProps: {
    //   text: '@nickname',
    // }
}
```

## 渲染子 cell

```
<r-list-tabs :tabs="tabs">
  <template slot-scope="scope">
    <van-cell :title="scope.item.nickname" value="内容2" :label="scope.item.mobile" is-link/>
  </template>
</r-list-tabs>
```
