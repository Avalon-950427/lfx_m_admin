import api from '@/api/api'
function tencentCaptcha(cb, _this) {
  // const _this = this
  if (window.VUE_APP_VALIDATE) {
    var captcha1 = new TencentCaptcha(
      // document.getElementById('TencentCaptchaBtn'),
      '2050298003',
      function(res) {
        if (res.ret === 0) {
          const params = {
            ticket: res.ticket,
            randstr: res.randstr
          }
          _this.$http
            .post(api.geetestValidate, params)
            .then((res) => {
              console.log(res)
              if (res.ret === 'success') {
                // _this.getSMSFn()
                cb()
              }
            })
            .catch((e) => {})
        } else {
          // _this.$toast('验证失败')
        }
      },
      {
        ready(opts) {
          let oT = document.getElementById('tcaptcha_transform')
          oT.style.transform = 'scale(0.9)'
        }
      }
    )
    captcha1.show() // 显示验证码
  } else {
    cb()
  }

  // return
  // initGT(this, this.$refs.wrap).then((res) => {})
}

export { tencentCaptcha }
