<template>
  <div>
    <div
      class="floatball"
      id="floatball"
      @mousedown="down"
      @touchstart.stop.prevent="down"
      @mousemove="move"
      @touchmove.stop.prevent="move"
      @mouseup="end"
      @touchend.stop.prevent="end"
      :style="{ top: position.y + 'px', left: position.x + 'px' }"
    >
      <div class="float-item">
        <van-image class="back" :src="backImg" @click.stop="back"></van-image>
      </div>
      <div class="float-item">
        <van-icon name="wap-home-o" color="#ddd" @click.stop="toHome" size="0.5rem"></van-icon>
        <!-- <van-image :src="homeImg" @click.stop="toHome"></van-image> -->
      </div>
    </div>
  </div>
</template>

<script>
  // 鼠标位置和div的左上角位置 差值
  let dx, dy, diff
  let screenWidth = window.screen.width
  let screenHeight = window.screen.height
  export default {
    props: {
      historyLength: {
        type: Number
      }
    },
    data() {
      return {
        backImg: require('@/assets/imgs/go-back.png'),
        // homeImg: require('@/assets/imgs/home.png'),
        flags: false,
        moved: false,
        position: {
          x: (335 / 375) * screenWidth,
          y: (450 / 667) * screenHeight
        }
      }
    },

    methods: {
      back() {
        // window.history.back()
        this.$router.back()
      },

      toHome() {
        this.$router.replace({ name: 'index' })
      },

      // 实现移动端拖拽
      down(event) {
        this.flags = true

        var touch
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        diff = touch.clientY - this.position.y
        // console.log('鼠标点所在位置', touch.clientX, touch.clientY)
        // console.log('div左上角位置', event.target.offsetTop, event.target.offsetLeft)
        dx = touch.clientX - event.target.offsetLeft
        dy = touch.clientY - event.target.offsetTop
      },
      move(event) {
        if (this.flags) {
          this.moved = true
          var touch
          if (event.touches) {
            touch = event.touches[0]
          } else {
            touch = event
          }
          // 定位滑块的位置
          // this.position.x = touch.clientX - dx
          this.position.y = touch.clientY - diff
          // 限制滑块超出页面
          // console.log('屏幕大小', screenWidth, screenHeight)
          // if (this.position.x < 0) {
          //   this.position.x = 0
          // } else if (this.position.x > screenWidth - touch.target.clientWidth) {
          //   this.position.x = screenWidth - touch.target.clientWidth
          // }
          if (this.position.y < 0) {
            this.position.y = 0
          } else if (this.position.y > screenHeight - (40 / 675) * screenHeight) {
            this.position.y = screenHeight - (40 / 675) * screenHeight
          }
          //阻止页面的滑动默认事件
          document.addEventListener(
            'touchmove',
            function() {
              event.preventDefault()
            },
            false
          )
        }
      },
      //鼠标释放时候的函数
      end(e) {
        if (!this.moved) {
          this.clickHandler(e)
        }
        this.moved = false
        this.flags = false
      },

      clickHandler(e) {
        if (e.target.parentElement.classList.value.indexOf('back') !== -1) {
          this.back()
        } else {
          this.toHome()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .floatball {
    position: fixed;
    right: 0;
    // bottom: 120px;
    z-index: 999 !important;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: center;
    width: 40px;
    // height: 40px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px 0 0 5px;
    .float-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 40px;
    }
    .van-image {
      width: 15px;
      height: 15px;
    }
  }
</style>
