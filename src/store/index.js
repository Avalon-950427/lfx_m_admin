import Vue from 'vue'
import Vuex from 'vuex'
import webapp from 'rnjs-webapp'
import wx from './wx.js'

Vue.use(Vuex)

export default new Vuex.Store({
  // 模块
  modules: {
    ...webapp.store,
    wx
  }
})
