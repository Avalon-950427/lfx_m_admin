<template>
  <div class="collapse-wrap">
    <van-collapse v-model="activeName" :accordion="accordion" border>
      <!-- {{ plan }} -->
      <van-collapse-item :name="index" v-for="(item, index) in plan" :key="index">
        <template #title>
          <div class="title flex justify-between">
            <div>第{{ index + 1 }}期 / {{ item.refundDay }}</div>
            <div class="flex">
              <div>￥{{ +item.principal + +item.monthInterest }}</div>
              <div class="status" v-if="!item.readonly">编辑</div>
            </div>
          </div>
        </template>
        <div class="content">
          <!-- <div v-if="!item.edit">
            <van-cell title="还款时间" :value="item.refundDay"></van-cell>
            <van-cell title="还款本金" :value="(+item.principal).toFixed(2)"></van-cell>
            <van-cell title="还款利息" :value="(+item.monthInterest).toFixed(2)"></van-cell>
            <van-cell title="还款总金额" :value="(+item.principal + +item.monthInterest).toFixed(2)"></van-cell>
          </div> -->
          <div>
            <van-field
              label="还款时间"
              input-align="right"
              placeholder="YYYY-MM-DD"
              :readonly="item.readonly"
              :value="item.refundDay"
              @input="inputTime($event, item)"
            ></van-field>
            <van-field
              label="还款本金"
              :readonly="item.readonly"
              input-align="right"
              :value="+item.principal"
              @input="inputPrincipal($event, item)"
            ></van-field>
            <van-field
              label="还款利息"
              :readonly="item.readonly"
              input-align="right"
              :value="+item.monthInterest"
              @input="inputMonthInterest($event, item)"
            ></van-field>
            <van-field label="还款总金额" input-align="right" readonly :value="+item.principal + +item.monthInterest"></van-field>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    props: {
      accordion: {
        type: Boolean,
        default: false
      },
      plan: {
        type: Array,
        default() {
          return []
        }
      }
    },
    created() {},
    data() {
      return {
        activeName: ''
      }
    },

    methods: {
      inputTime: function(e, item) {
        item.refundDay = e
      },

      inputPrincipal: function(e, item) {
        item.principal = e
      },

      inputMonthInterest: function(e, item) {
        item.monthInterest = e
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/custom.less';
  .collapse-wrap {
    overflow: hidden;
    margin: 11px 14px 0;
    border-radius: 10px;
    font-size: @fz-14;
    .title {
      .status {
        margin-left: 10px;
        color: @theme-color;
      }
    }
    /deep/ .van-collapse-item__content {
      padding: 0;
    }
  }
</style>
