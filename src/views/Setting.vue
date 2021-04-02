<template>
  <div class="page-wrap" v-if="settingMenu">
    <div class="img-wrap">
      <van-image class="block" fit="contain" radius="0.4rem" :src="settingMenu.logo"></van-image>
    </div>
    <van-cell
      v-for="(cell, index) in settingMenu.tabList"
      :key="index"
      :title="cell.title"
      :value="cell.value"
      :is-link="cell.arrow"
      :style="{ 'margin-bottom': cell['margin-bottom'] }"
      @click="clickHandler(cell)"
    >
      <template v-if="cell.extra" #extra>
        <van-switch :value="cell.value" :disabled="cell.extraDisabled" @input="switchHandler(cell)" :active-color="colors.theme" />
      </template>
    </van-cell>
  </div>
</template>

<script>
  import api from '@/api/api'
  import { Dialog } from 'vant'
  import { COLORS } from '@/utils/enum.js'
  import { getApiPrefix, getApiPath } from '@/utils/util.js'
  export default {
    data() {
      return {
        colors: COLORS,
        checked: true,
        settingMenu: null
      }
    },

    created() {
      this.getSettingsMenu()
    },

    methods: {
      getSettingsMenu() {
        this.$http.get(api.settingsMenu).then((res) => {
          res.tabList.sms.value = Boolean(res.tabList.sms.value)
          this.settingMenu = res
        })
      },

      switchHandler(cell) {
        Dialog.confirm({
          message: '温馨提示，是否切换开关',
          confirmButtonColor: COLORS.theme
        }).then((res) => {
          let params = {
            is_message_notice: +!cell.value
          }
          this.$http.put(api.update, params).then((res) => {
            cell.value = !cell.value
          })
        })
      },

      clickHandler(cell) {
        if (!cell.arrow) {
          return
        }
        const _this = this
        if (cell.title === '退出登录') {
          Dialog.confirm({
            message: '温馨提示，是否确认退出登录',
            confirmButtonColor: COLORS.theme
          }).then((res) => {
            let prefix = getApiPrefix(api.logout),
              path = getApiPath(api.logout)
            _this
              .$axios(prefix)
              .get(path)
              .then((res) => {
                _this.$http.cookies.remove('token')
                _this.$http.cookies.remove('uuid')
                _this.$router.replace(res.backurl)
              })
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/css/custom.less');
  .page-wrap {
    width: 100%;
    min-height: 100%;
    background-color: @background;
    .img-wrap {
      overflow: hidden;
      height: 190px;
      margin-bottom: 10px;
      background-color: white;
      .van-image {
        width: 80px;
        height: 80px;
        margin: 38px auto 0;
        border: 1px solid @lighter-grey;
        // border-radius: 20px;
      }
    }
    .van-cell {
      height: 50px;
      /deep/ .van-cell__title {
        font-size: @fz-18;
      }
      /deep/ .van-cell__value {
        font-size: @fz-12;
      }
      /deep/ .van-cell__title span,
      /deep/ .van-cell__value span,
      .van-icon {
        line-height: 30px;
      }
      .van-switch {
        margin-top: 3px;
      }
    }
  }
</style>
