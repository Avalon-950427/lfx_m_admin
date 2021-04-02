<template>
  <div class="card-wrap" v-if="info">
    <div class="card-top flex" @click="clickHandler('topHandler')">
      <van-image class="shrink-0 align-self-end" :src="info.logo"></van-image>
      <div class="top-info grow-1">
        <div>{{ info.topType }}</div>
        <div class="top-total">
          <span>{{ info.title }}</span>
          {{ info.showUnit ? info.unit : '' }}
        </div>
      </div>
      <van-icon class="shrink-0 arrow align-self-center" name="arrow"></van-icon>
      <!-- <van-image class="" :src="require('@/assets/imgs/setting.png')"></van-image> -->
    </div>
    <div class="statistic-wrap" @click="clickHandler('bottomHandler')">
      <div class="flex flex-wrap">
        <div class="statistic shrink-0" v-for="(item, index) in info.statistic" :key="index">
          <div>{{ item.label }}</div>
          <div class="value">
            <span>{{ item.value }}</span>
            （{{ item.unit }}）
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      info: {
        required: true
      }
    },

    methods: {
      clickHandler(type) {
        this.$emit(type)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/css/custom.less');
  .card-wrap {
    width: 347px;
    margin: 20px auto 0;
    padding: 1px 0;
    background-color: white;
    border-radius: 10px;
    .card-top {
      margin: 20px 15px 5px 10px;
      .van-image {
        width: 40px;
        height: 40px;
      }
      .arrow {
        width: 25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        font-size: 15px;
        color: @text-grey;
        border: 1px solid @text-grey;
        border-radius: 50%;
      }
      .top-info {
        margin-left: 15px;
        font-size: @fz-15;
        color: @text-grey;
        .top-total {
          margin-top: 5px;
          font-size: @fz-13;
          color: @bold-text-grey;
          span {
            font-size: @fz-21;
            font-weight: bold;
          }
        }
      }
    }
    .statistic-wrap {
      margin-bottom: 20px;
      .statistic {
        width: calc(50% - 14px);
        margin-top: 20px;
        margin-left: 14px;
        font-size: @fz-13;
        color: @text-grey;
        .value {
          margin-top: 2px;
          color: @bold-text-grey;
          span {
            font-size: @fz-18;
            font-weight: bold;
          }
        }
      }
    }
  }
</style>
