<template>
  <div class="guide-wrap" @touchmove="touchMoveHandler">
    <van-image class="guide-arrow" :src="require('@/assets/imgs/guide-arrow.png')"></van-image>
    <van-image class="guide" :src="require('@/assets/imgs/guide.png')"></van-image>
  </div>
</template>

<script>
  export default {
    methods: {
      touchMoveHandler(e) {
        e.preventDefault()
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/css/custom.less');
  .guide-wrap {
    position: fixed;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.9);
    .guide-arrow {
      position: absolute;
      right: 21px;
      top: 15px;
      width: 129px;
      height: 136px;
    }
    .guide {
      position: absolute;
      left: 50%;
      top: 169px;
      width: 175px;
      height: 80px;
      transform: translate(-50%, 0);
    }
  }
</style>
