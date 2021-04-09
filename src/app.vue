<template>
  <div id="app" class="ignore-body" v-cloak>
    <!-- 路由的meta没有keepAlive，则使用这个route-view -->
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <keep-alive>
      <!-- 如果某个路由的meta的keepAlive为true，则为需要保存组件状态，此时使用这个route-view -->
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <!-- <Fab v-if="showFab" :historyLength="historyLength"></Fab> -->
  </div>
</template>

<script>
  import Fab from '@/components/fab/Fab.vue'
  import { mapState } from 'vuex'
  import { COLORS } from '@/utils/enum.js'
  import config from '../package.json'
  import api from '@/api/api'
  import axios from 'axios'
  const TABS = ['index', 'user', 'team', 'information']
  export default {
    data() {
      return {
        colors: COLORS,
        tabbar: [],
        timer: null, // 定时器
        splashRes: null,
        historyLength: 1,
        showFab: false
      }
    },

    components: {
      Fab
    },

    created() {
      if (this.$route.query.openid) {
        this.$store.commit('home/saveSplash')
      }
      this.setConfigs()
      this.getStorage()
      // this.setStorage()
    },

    watch: {
      $route: {
        deep: true,
        handler(newVal) {
          if (TABS.includes(newVal.name) || (this.$route.name === 'agent' && this.$route.query.id)) {
            this.showFab = false
          } else {
            this.showFab = true
          }
          // this.$store.commit('home/saveFirstUrl', this.$route.fullPath)
          this.historyLength = window.history.length
        }
      }
    },

    computed: {
      ...mapState('home', ['tabIndex', 'splash', 'firstUrl'])
    },

    methods: {
      /**
       * 添加自定义事件configs的监听，当core中的响应拦截器中截取到response有configs数据时，就会dispatch这里的configs事件
       */
      setConfigs() {
        const _this = this
        window.addEventListener(
          'configs',
          function(e) {
            window.configs = e.configs.tabbar
            if (!_this.tabbar.length) {
              window.configs.forEach((item) => {
                item.img[1] += '?' + config.version
                _this.tabbar.push(item)
              })
            }
          },
          false
        )
      },

      /**
       * 获取sessionStorage
       */
      getStorage() {
        if (sessionStorage.getItem('store')) {
          let storage = JSON.parse(sessionStorage.getItem('store'))
          storage.home.wxSignUrl = ''
          this.$store.replaceState(Object.assign({}, this.$store.state, storage))
        }
      }

      /**
       * 当页面触发unload事件之前，将store中的数据存储到sessionStorage中
       */
      // setStorage() {
      //   window.addEventListener('pagehide', () => {
      //     this.$store.commit('home/setWechatSignUrl', '', false)
      //     sessionStorage.setItem('store', JSON.stringify(this.$store.state))
      //   })
      // },
    }
  }
</script>

<style lang="less">
  @import url('~@/assets/css/custom.less');
  // @font-face {
  //   font-family: 'sy-m';
  //   src: url('./assets/sy.otf');
  // }

  // @font-face {
  //   font-family: 'sy-r';
  //   font-weight: 400;
  //   src: url('./assets/sy.otf');
  // }

  // @font-face {
  //   font-family: 'sy-b';
  //   font-weight: 700;
  //   src: url('./assets/sy.otf');
  // }
  html {
    max-width: @max-width;
    margin: auto;
  }
  #app {
    position: relative;
    height: 100vh;
    margin: auto;
    font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', STHeiti, 'Microsoft Yahei', Tahoma, Simsun, sans-serif;
    font-weight: 500;
    letter-spacing: 1px;
    background-color: white;
    -webkit-overflow-scrolling: touch;
  }

  .ignore-body {
    max-width: @max-width;
    margin: auto;
  }

  .rui-tabbar {
    background-color: white;
  }

  [v-cloak] {
    display: none;
  }
</style>
