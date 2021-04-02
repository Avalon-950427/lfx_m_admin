import api from '@/api/api'
/**
 * 初始化微信jssdk
 */
function initWxSdk(_this, url, title, desc, shareUrl, img) {
  const params = {
    // url: _this.wxSignUrl ? this.wxSignUrl : window.location.href
    url: url
  }
  _this.$http.get(api.getWxParams, { params: params }).then((res) => {
    wx.config({
      debug: false,
      appId: res.appId,
      timestamp: res.timestamp,
      nonceStr: res.nonceStr,
      signature: res.signature,
      jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'previewFile'],
      openTagList: ['wx-open-launch-weapp']
    })
    wx.ready(function(res) {
      // 分享到朋友
      wx.updateAppMessageShareData({
        title: title || '乐蜂享', // 分享标题
        desc: desc, // 分享描述
        link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: img, // 分享图标
        success: function() {
          // 设置成功
        }
      })
      wx.updateTimelineShareData({
        title: title || '乐蜂享', // 分享标题
        link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: img, // 分享图标
        success: function() {
          // 设置成功
        }
      })
      let timer = setTimeout(() => {
        let btn = document.getElementById('launch-btn')
        if (btn) {
          btn.addEventListener('launch', function(e) {
            if (!e.isTrusted) {
              let event = new CustomEvent('launchWeapp')
              window.dispatchEvent(event)
            }
          })
          btn.addEventListener('ready', function(e) {})
          btn.addEventListener('error', function(e) {
            Dialog.confirm({ title: '友情提示', message: '对接错误，请联系管理员' })
          })
        }
        clearTimeout(timer)
      }, 500)
    })
    wx.error(function(res) {
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
    })
  })
}

// 获取真实有效微信签名URL
function getWechatSignUrl(to) {
  // if (isIos()) {
  return window.location.href.split('#')[0]
  // } else {
  //   // 此处$appHost需要自行处理
  //   return (location.protocol + '//' + location.host + '/m' + (to.fullPath === '/' ? '' : to.fullPath)).split('#')[0]
  // }
}

export { initWxSdk, getWechatSignUrl }
