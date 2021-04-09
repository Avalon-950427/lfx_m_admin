<template>
  <div class="order-wrap " v-if="info">
    <div class="order-num">
      <span>进件编号</span>
      [{{ info.order_no }}]
    </div>
    <div class="order-content-wrap flex">
      <van-image class="shrink-0" :src="info.product_logo"></van-image>
      <div class="order-content grow-1">
        <div class="content-top flex justify-between">
          <span>{{ info.name }} {{ info.mobile }}</span>
          <div style="margin-bottom: 4px;">
            ￥
            <span>{{ info.loan_amount }}</span>
            <span class="unit">万元</span>
          </div>
        </div>
        <div class="order-type flex align-items-center">
          {{ info.product_title }}
          <span class="hairline" v-if="business">{{ business.title }}</span>
        </div>
        <div class="order-time">
          {{ info.add_time | formatDate }}
          <span>申报</span>
        </div>
        <van-field
          placeholder="添加备注"
          type="textarea"
          rows="1"
          :autosize="{ minHeight: 25 }"
          maxlength="200"
          v-model="info.reviewer_remark"
          readonly
          @click="addRemark"
        ></van-field>
      </div>
    </div>
    <div class="btns flex justify-end">
      <van-button v-if="showBtns" round @click="completeOrder">完成</van-button>
      <van-button v-if="showBtns" round @click="closeOrder">拒绝</van-button>
      <!-- <a href="https://download.pc6.com/down/151529/">下载</a> -->
      <van-button round :color="colors.theme" @click="download">下载资料</van-button>
    </div>
  </div>
</template>

<script>
  import { Dialog } from 'vant'
  import api from '@/api/api'
  import _ from 'lodash'
  import { COLORS, ORDER_CATEGORY } from '@/utils/enum.js'
  export default {
    props: {
      info: {
        type: Object,
        default: null
      },
      business: {
        type: Object
      },
      remark: {
        type: String,
        require: true
      },
      showBtns: {
        type: Boolean
      }
    },

    data() {
      return {
        colors: COLORS
        // showDialog: false
      }
    },

    filters: {
      formatDate(date) {
        let dateArr = date.split(' ')
        return `${dateArr[0]} [${dateArr[1]}]`
      }
    },

    methods: {
      completeOrder: _.debounce(
        function() {
          Dialog.confirm({
            message: '温馨提示，是否确认完成该进件？',
            confirmButtonColor: COLORS.theme
          }).then(() => {
            let params = {
              sn: this.info.sn,
              // reviewer_remark: this.remark,
              status: ORDER_CATEGORY[2].type
            }
            this.$http.put(api.changeOrder, params).then((res) => {
              this.$emit('changeSuccess', this.info, 'confirm')
            })
          })
        },
        1000,
        { leading: true, trailing: false }
      ),

      closeOrder: _.debounce(
        function() {
          Dialog.confirm({
            message: '温馨提示，是否确认关闭该进件？'
          }).then(() => {
            let params = {
              sn: this.info.sn,
              // reviewer_remark: this.remark,
              status: ORDER_CATEGORY[1].type
            }
            this.$http.put(api.changeOrder, params).then((res) => {
              this.$emit('changeSuccess', this.info, 'close')
            })
          })
        },
        1000,
        { leading: true, trailing: false }
      ),

      download: _.debounce(
        function() {
          this.$emit('download', this.info.sn)
        },
        2000,
        { leading: true, trailing: false }
      ),

      addRemark: _.debounce(
        function() {
          // this.showDialog = true
          this.$emit('addRemark', this.info)
        },
        1000,
        { leading: true, trailing: false }
      )
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/css/custom.less');
  .order-wrap {
    // width: 347px;
    width: auto;
    margin: 0 14px 15px;
    padding: 16px 14px 20px;
    background-color: white;
    border-radius: 10px;
    .order-num {
      position: relative;
      font-size: @fz-14;
      span {
        font-weight: bold;
      }
      ::before {
        position: absolute;
        left: -14px;
        content: '';
        width: 3px;
        height: 17px;
        background-color: black;
      }
    }
    .order-content-wrap {
      margin-top: 25px;
      .van-image {
        width: 40px;
        height: 40px;
      }
      .order-content {
        margin-left: 14px;
        .content-top {
          font-size: @fz-14;
          font-weight: bold;
          span {
            vertical-align: bottom;
          }
        }
        .order-type {
          font-size: @fz-14;
          color: @text-grey;
          span {
            display: inline-block;
            margin-left: -10px;
            padding: 6px;
            font-size: @fz-20;
            color: @theme-color;
            border: 1px solid @theme-color;
            border-radius: 5px;
          }
        }
        .order-time {
          margin-top: 20px;
          font-size: @fz-14;
          font-weight: bold;
          span {
            color: @text-grey;
          }
        }
        .van-field {
          margin-top: 15px;
          padding: 5px 10px;
          background-color: @input-back;
          border-radius: 3.5px;
        }
        .van-field textarea::-webkit-scrollbar {
          display: none;
        }
      }
    }
    .btns {
      margin-top: 15px;
      .van-button {
        height: 35px;
        margin-left: 10px;
        font-size: @fz-14;
        color: @text-grey;
      }
    }
    .van-overlay {
      z-index: 9999 !important;
    }
    .van-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
