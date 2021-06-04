<template>
  <div class="login-wrap bz-bd">
    <van-image class="block" :src="require('@/assets/imgs/logo.png')"></van-image>
    <Field v-for="(field, index) in fields" :key="index" :info="field" :ref="field.ref" @buttonHandler="buttonHandler"></Field>
    <van-button block hairline :color="colors.theme" @click="login">登录</van-button>
    <div class="protocol">
      点击登录，即表示您已阅读并同意
      <span>《软件许可及服务协议》</span>
      与
      <span>《软件许可及服务协议》</span>
    </div>
  </div>
</template>

<script>
  import { fields } from '@/configs/login'
  import { COLORS } from '@/utils/enum.js'
  import { phoneValidator, getApiPrefix, getApiPath } from '@/utils/util.js'
  import { tencentCaptcha } from '@/utils/tencentCaptcha.js'
  import Field from '@/components/commonField/Field'
  import api from '@/api/api'
  import _ from 'lodash'
  export default {
    data() {
      return {
        fields: fields,
        colors: COLORS,
        canSend: true,
        loginParams: null,
        countDown: 59
      }
    },

    components: {
      Field
    },

    created() {
      this.getLoginParams()
    },

    computed: {},

    methods: {
      getLoginParams() {
        this.$http.get(api.login).then((res) => {
          this.loginParams = res
        })
      },

      buttonHandler: _.debounce(
        function() {
          if (!this.canSend) {
            this.$alert('请勿重复发送验证码', '系统提示')
            return
          }
          if (!phoneValidator(this.fields.tel.value)) {
            this.$toast('请输入正确的手机号')
            return
          }
          let cb = this.getSmsFn
          tencentCaptcha(cb, this)
        },
        1000,
        { leading: true, trailing: false }
      ),

      /**
       * 发送手机验证码
       */
      async getSmsFn() {
        let params = {
          mobile: this.fields.tel.value,
          type: this.loginParams.smsType.login
        }
        this.canSend = false
        let prefix = getApiPrefix(api.getSMS),
          path = getApiPath(api.getSMS)

        this.$axios(prefix)
          .post(path, params)
          .then((res) => {
            this.countDownHandler()
            this.$refs[this.fields.smscode.ref][0].$el.children[0].children[0].children[0].children[0].focus()
          })
          .catch((e) => {
            this.canSend = true
          })
      },

      /**
       * 短信验证码60s倒计时，60过后可重新发送
       */
      countDownHandler() {
        this.fields.smscode.button = this.countDown + '秒后重获'
        this.timer = setInterval(() => {
          if (this.countDown) {
            --this.countDown
            this.fields.smscode.button = this.countDown + '秒后重获'
          } else {
            clearInterval(this.timer)
            this.countDown = 60
            this.fields.smscode.button = '重新发送'
            this.canSend = true
          }
        }, 1000)
      },

      login: _.debounce(
        function() {
          if (!phoneValidator(this.fields.tel.value)) {
            this.$toast('请输入正确的手机号')
            return
          }
          if (this.fields.smscode.value.length !== 6) {
            this.$toast('请输入短信验证码')
            return
          }
          const params = {
            mobile: this.fields.tel.value,
            smscode: this.fields.smscode.value
          }
          this.$http.post(api.login, params).then((res) => {
            this.$router.replace('/')
            const { userInfo } = res
            this.$http.cookies.set('uuid', userInfo.uuid)
            this.$http.setToken(userInfo)
            // this.$http.cookies.set('token', userInfo.token, { expires: new Date(new Date().valueOf() + userInfo.expireTime) })
            this.fields.smscode.value = ''
            this.fields.smscode.button = '获取验证码'
            this.countDown = 60
            clearInterval(this.timer)
          })
        },
        1000,
        { leading: true, trailing: false }
      )
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/custom.less';
  .login-wrap {
    // overflow: scroll;
    min-height: 100%;
    padding-top: 1px;
    .van-image {
      width: 110px;
      height: 60px;
      margin: 60px auto 50px;
    }

    /deep/ .text-field {
      width: 82%;
      padding: 0;
    }

    /deep/ .van-field {
      margin-top: 0;
      font-size: @fz-17;
      border-radius: 0;
      input {
        height: 45px;
      }
      input::placeholder {
        font-size: @fz-17;
        color: @lighter-grey;
      }
      .van-button {
        border: none;
      }
    }
    .field-wrap + .field-wrap /deep/ .van-field .van-field__body {
      /* 第二个field开始的组件下面的van-field__body加上边框 */
      border-top: 1px solid @lighter-grey;
    }

    .van-button {
      width: 82%;
      margin: 8% auto 5%;
      font-size: @fz-17;
    }

    .protocol {
      margin: 0 35px;
      font-size: @fz-11;
      color: @grey;
      span {
        color: @theme-color;
      }
    }
  }
  // .title-wrap {
  //   padding-top: 32.5px;
  //   .van-image {
  //     display: block;
  //     width: 64px;
  //     height: 64px;
  //     margin: 0 auto;
  //   }
  // }
  // .hidden {
  //   visibility: hidden;
  // }
</style>
