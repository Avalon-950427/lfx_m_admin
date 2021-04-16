<template>
  <div class="page-wrap">
    <van-sticky>
      <van-search placeholder="搜索进件" background="white" v-model="search" @input="searchHandler"></van-search>
      <div class="flex justify-between tabs-wrap">
        <van-tabs v-model="active" @change="changeTab">
          <van-tab v-for="(orderCategory, index) in orderCategories" :key="index" :title="orderCategory.title"></van-tab>
        </van-tabs>
        <van-dropdown-menu :active-color="colors.theme">
          <van-dropdown-item v-model="orderCategories[active].value" :options="orderCategories[active].businesses" @change="dropdownChange" />
        </van-dropdown-menu>
      </div>
    </van-sticky>
    <van-tabs class="tab-content" v-model="active" swipeable animated>
      <van-tab v-for="(orderCategory, index) in orderCategories" :key="index">
        <van-list
          v-model="orderCategory.loading"
          :finished="orderCategory.finished"
          :error.sync="orderCategory.error"
          :finish-text="orderCategory.orders.length ? '没有更多了' : ''"
          error-text="请求失败，点击重新加载"
          :immediate-check="false"
          @load="getOrderList"
        >
          <div v-if="orderCategory.orders.length">
            <Order
              v-for="(order, idx) in orderCategory.orders"
              :key="idx"
              :info="order"
              :business="findBusiness(orderCategory.businesses, order)"
              :remark="remark"
              :showBtns="active ? false : true"
              @changeSuccess="changeSuccess"
              @addRemark="addRemark"
              @download="download"
            ></Order>
          </div>
          <van-empty v-else :image="require('@/assets/imgs/empty.png')">暂无产品</van-empty>
        </van-list>
      </van-tab>
    </van-tabs>
    <van-dialog v-model="showDialog" title="添加备注" show-cancel-button :confirm-button-color="colors.theme" @confirm="submitRemark">
      <van-field placeholder="请输入进件备注" input-align="center" v-model="remark"></van-field>
    </van-dialog>
    <van-overlay :show="show">
      <van-loading type="spinner" size="24px">下载中...</van-loading>
    </van-overlay>
    <Guide v-if="showGuide" @click.native="clickGuide"></Guide>
  </div>
</template>

<script>
  import Order from '@/components/Order.vue'
  import Guide from '@/components/Guide.vue'
  import { Dialog } from 'vant'
  import api from '@/api/api'
  import _ from 'lodash'
  import md5 from 'md5'
  import { COLORS, ORDER_CATEGORY } from '@/utils/enum.js'
  import { isWeixin, get_android_version, isIos, getClientInfo, weixinVersion } from '@/utils/util.js'
  const PAGE_SIZE = 10
  ORDER_CATEGORY.forEach((item) => {
    item.page = 0
    item.businesses = [] // dropdown的options
    item.value = 0 // dropdown的value
    item.orders = []
    item.finished = false
    item.loading = false
    item.error = false
  })
  export default {
    data() {
      return {
        colors: COLORS,
        orderCategories: ORDER_CATEGORY,
        active: 0,
        search: '',
        showDialog: false,
        remark: '',
        show: false,
        showGuide: false,
        order: null, // 当前修改备注的订单数据
        timer: null
      }
    },

    components: {
      Order,
      Guide
    },

    created() {
      new Promise((resolve, reject) => {
        ORDER_CATEGORY.forEach((item) => {
          item.page = 0
          item.businesses = [] // dropdown的options
          item.value = 0 // dropdown的value
          item.orders = []
          item.finished = false
          item.loading = false
          item.error = false
        })
        resolve()
      })
        .then((res) => {
          this.getOrderList()
        })
        .catch((e) => {
          console.log(e)
        })
    },

    methods: {
      getOrderList() {
        let currentCategory = this.orderCategories[this.active]
        let params, path
        if (currentCategory.type === 1) {
          params = {
            page: ++currentCategory.page,
            page_size: PAGE_SIZE,
            business_id: currentCategory.businesses.length ? currentCategory.businesses[currentCategory.value].id : '', // 业务类型
            keyword: this.search
          }
          path = api.getRejectOrderList
        } else {
          params = {
            status: currentCategory.type,
            page: ++currentCategory.page,
            page_size: PAGE_SIZE,
            keyword: this.search,
            business_id: currentCategory.businesses.length ? currentCategory.businesses[currentCategory.value].id : ''
          }
          path = api.getOrderList
        }
        this.$http
          .get(path, { params: params })
          .then((res) => {
            currentCategory.orders.push(...res.orderPage.data)
            if (!currentCategory.businesses.length) {
              res.business.forEach((item, index) => {
                item.text = item.title
                item.value = index
                currentCategory.businesses.push(item)
              })
            }
            if (currentCategory.orders.length >= res.orderPage.count) {
              currentCategory.finished = true
            }
            currentCategory.loading = false
            this.orderCategories[this.active] = currentCategory
          })
          .catch((e) => {
            console.log(e)
            currentCategory.loading = false
            currentCategory.error = true
          })
      },

      searchHandler: _.debounce(
        function() {
          let currentCategory = this.orderCategories[this.active]
          currentCategory.orders = [] // 清空当前订单状态分类的所有订单列表
          currentCategory.page = 0 // 重置当前订单状态分类列表的分页数据
          currentCategory.finished = false
          currentCategory.loading = false
          currentCategory.error = false
          this.getOrderList()
        },
        1000,
        { leading: true, trailing: true }
      ),

      changeTab() {
        let currentCategory = this.orderCategories[this.active]
        if (!currentCategory.finished) {
          this.getOrderList()
        }
      },

      dropdownChange: _.debounce(
        function() {
          let currentCategory = this.orderCategories[this.active]
          currentCategory.orders = [] // 清空当前订单状态分类的所有订单列表
          currentCategory.page = 0 // 重置当前订单状态分类列表的分页数据
          currentCategory.finished = false
          currentCategory.loading = false
          currentCategory.error = false
          this.getOrderList()
        },
        1000,
        { leading: true, trailing: false }
      ),

      findBusiness(businesses, info) {
        return businesses.find((item) => info.business_id === item.id)
      },

      addRemark(info) {
        this.showDialog = true
        this.order = info
      },

      changeSuccess(info, type) {
        let currentCategory = this.orderCategories[this.active]
        let index = currentCategory.orders.findIndex((item, index) => {
          return item.sn === info.sn
        })
        if (type === 'close') {
          this.orderCategories[1].orders.push(currentCategory.orders[index])
        } else if (type === 'confirm') {
          this.orderCategories[2].orders.push(currentCategory.orders[index])
        }
        currentCategory.orders.splice(index, 1)
      },

      download(sn) {
        if ((isWeixin() && isIos()) || getClientInfo() === 'PC') {
          if (isWeixin() && parseFloat(weixinVersion()) < 8.0) {
            Dialog.alert({ message: '微信版本过低，请升级微信', confirmButtonColor: this.colors.theme })
            return
          }
          this.show = true
          let timestamp = Date.now(),
            hash = md5(timestamp + 'lfx')
          let src = `/madminapi/order/download?_responseType=blob&sn=${sn}`
          let oA = document.createElement('a')
          oA.href = src
          oA.click()
          this.timer = setTimeout(() => {
            this.show = false
            clearTimeout(this.timer)
          }, 3000)
        } else {
          this.$router.push({ name: 'guide', query: { src: `/madminapi/order/download?_responseType=blob&sn=${sn}` } })
        }
      },

      submitRemark() {
        let params = {
          sn: this.order.sn,
          reviewer_remark: this.remark
        }
        this.$http.put(api.changeOrder, params).then((res) => {
          this.order.reviewer_remark = this.remark
          this.remark = ''
        })
      },

      clickGuide() {
        this.showGuide = false
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/css/custom.less');
  .page-wrap {
    min-height: 100%;
    background: linear-gradient(to bottom, white 100px, @background 130px, @background);
    .van-sticky {
      .van-search {
        box-sizing: border-box;
        .van-search__content {
          background-color: @background;
        }
      }
      .tabs-wrap {
        width: 100%;
        padding: 0 14px;
        background: white;
        box-sizing: border-box;
        /deep/ .van-tabs__nav {
          display: flex;
          font-size: @fz-17;
          font-weight: bold;
          color: @lighter-grey;
          .van-tab {
            flex: none !important;
            padding: 0;
            margin-right: 20px;
          }
          .van-tab--active {
            font-weight: 700;
          }
        }
        /deep/ .van-tabs__nav--complete {
          padding-left: 0;
          padding-right: 0;
        }
        /deep/ .van-tabs__line {
          bottom: 22px;
          width: 27px;
          height: 3px;
          background-color: @theme-color;
          border-radius: 2px;
        }
        /deep/ .van-dropdown-menu__bar {
          border-bottom: none;
        }
      }
    }
    .tab-content {
      margin-top: 15px;
      /deep/ .van-tabs__wrap {
        display: none;
      }
    }
    .van-dialog .van-cell {
      width: 80%;
      margin: 10px auto;
      border: 1px solid @input-back;
      border-radius: 5px;
    }
    .van-overlay {
      // position: relative;
      z-index: 9999 !important;
      .van-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
