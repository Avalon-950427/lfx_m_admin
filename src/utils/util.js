import md5 from 'md5'
function phoneValidator(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

function idCardValidator(idCard) {
  if (idCard.length === 15) {
    return /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/.test(idCard)
  } else if (idCard.length === 18) {
    return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(idCard)
  } else {
    return false
  }
}

/**
 * 日期格式化函数
 * @param {Number} time 时间戳
 */
function timeParser(time) {
  const date = new Date(time)
  return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}`
}

/**
 * 带小时和分钟的日期格式化函数
 * @param {Number} time 时间戳
 */
function timeParserWithHourMinutes(time) {
  const date = new Date(time)
  return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`
}

/**
 * 将事件转化为日期，昨天，去年等
 * @param {Number} time 时间戳
 */
function dateParser(time) {
  let now = Date.now()
  time *= 1000
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const threeMin = 3 * 60 * 1000
  const oneHour = 60 * 60 * 1000
  const oneDay = 24 * oneHour
  const today = new Date(year, month - 1, day).valueOf() + oneDay - 1 // 发布当天23:59的时间戳
  const twoDay = today + oneDay
  const oneYear = oneDay * 365
  let diff = now - time
  if (diff <= threeMin) {
    return '刚刚'
  }
  if (diff > threeMin && diff <= oneHour) {
    return Math.floor(diff / 1000 / 60) + '分钟前'
  }
  if (diff > oneHour && now <= today) {
    return timeParserWithHourMinutes(time).split(' ')[1]
  }
  if (now > today && now <= twoDay) {
    return '昨天' + timeParserWithHourMinutes(time).split(' ')[1]
  }
  if (now > twoDay && diff <= oneYear) {
    let date = timeParser(time).replace(/-/g, '.')
    return date.split('.')[1] + '.' + date.split('.')[2]
  }
  if (diff > oneYear) {
    return timeParser(time).replace(/-/g, '.')
  }
}

/**
 * 数字补零函数
 * @param {Number} number 数字
 */
function addZero(number) {
  return number < 10 ? '0' + number : number
}

/**
 * 登录时获取用户信息
 */
function getUserInfo(api, _this) {
  _this.$http.get(api.getUserInfo).then((res) => {
    _this.$http.cookies.set('idCardAuth', res.idCardAuth)
    _this.$http.cookies.set('avatar', res.avatar)
    _this.$http.cookies.set('nickname', res.nickname)
  })
}

/**
 * 根据对象中的属性进行去重
 * @param {Array} arr 要去重的数组
 * @param {String} name 去重的属性根据
 */
function filterArr(arr, name) {
  let hash = {}
  return arr.reduce((ss, item) => {
    // reduce累计器, ss是具体满足条件后返回的数据, item是数组依次循环的每一项
    hash[item[name]] ? '' : (hash[item[name]] = true && ss.push(item))
    // 1、判断对象的键值是否存在
    return ss
  }, [])
}

/**
 * 深拷贝函数
 * @param {Object} target 要拷贝的对象
 */
function deepClone(target) {
  // 检测拷贝目标对象是否是对象/数组/函数等引用类型,如果不是引用类型则直接返回该值
  if (!(target instanceof Object) || 'isClone' in target) {
    return target
  }
  // 走到这里表示拷贝目标对象一定是引用类型
  let clone = new target.constructor()
  // 获取目标对象实例上所有属性名
  let keys = Reflect.ownKeys(target)
  for (let key in keys) {
    // 如果目标对象实例上有key属性名,则执行if语句
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      // 防止循环引用无限迭代
      target['isClone'] = null
      clone[key] = deepClone(target[key])
      delete target['isClone']
    }
  }
  return clone
}

/**
 * 将请求的返回值中的每个产品放款额格式化为千分位
 * @param {Number} number 要转为千分位的数字
 */
function thousands(number) {
  return (number * 10000).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  // res.products.list.forEach((item) => {
  //   item.amount_max = (item.amount_max * 10000).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  // })
}

function wetherScroll() {
  let startX = 0,
    startY = 0,
    endX = 0,
    endY = 0,
    clientWidth = document.documentElement.clientWidth,
    moveLength
  var el = document.getElementsByTagName('body')[0]
  el.addEventListener('touchstart', function(e) {
    startX = e.touches[0].pageX
    startY = e.touches[0].pageY
  })
  //获取点击结束后的坐标
  el.addEventListener('touchend', function(e) {
    endX = e.changedTouches[0].pageX
    endY = e.changedTouches[0].pageY
    var x = Math.abs(endX - startX)
    var y = Math.abs(endY - startY)
    if (x / clientWidth > 0.3) {
      // console.log(this)
    }
    //长方形的斜边长 = 两个直线的平方的和的平方根
    // moveLength = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    // alert('本次的移动距离为：' + moveLength)
  })

  return
  body.bind('touchstart', function(event) {
    var touch = event.targetTouches[0]
    //滑动起点的坐标
    startX = touch.pageX
    startY = touch.pageY
    // console.log("startX:"+startX+","+"startY:"+startY);
  })
  body.bind('touchmove', function(event) {
    var touch = event.targetTouches[0]
    //手势滑动时，手势坐标不断变化，取最后一点的坐标为最终的终点坐标
    endX = touch.pageX
    endY = touch.pageY
    // console.log("endX:"+endX+","+"endY:"+endY);
  })
  body.bind('touchend', function(event) {
    var distanceX = endX - startX,
      distanceY = endY - startY
    // console.log("distanceX:"+distanceX+","+"distanceY:"+distanceY);
    //移动端设备的屏幕宽度
    var clientHeight = document.documentElement.clientHeight
    // console.log(clientHeight;*0.2);
    //判断是否滑动了，而不是屏幕上单击了
    if (startY != Math.abs(distanceY)) {
      //在滑动的距离超过屏幕高度的20%时，做某种操作
      if (Math.abs(distanceY) > clientHeight * 0.2) {
        //向下滑实行函数someAction1，向上滑实行函数someAction2
        distanceY < 0 ? someAction1() : someAction2()
      }
    }
    startX = startY = endX = endY = 0
  })
}

// 全局判断是否IOS方法
function isIos() {
  const u = navigator.userAgent
  return u.indexOf('iPhone') > -1 || u.indexOf('Mac OS') > -1
}

function isWeixin() {
  //判断是否是微信
  var ua = navigator.userAgent.toLowerCase()
  return ua.match(/MicroMessenger/i) == 'micromessenger'
}

function weixinVersion() {
  var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)
  return wechatInfo[1]
}

function get_android_version() {
  var ua = navigator.userAgent.toLowerCase()
  var version = null
  if (ua.indexOf('android') > 0) {
    var reg = /android [\d._]+/gi
    var v_info = ua.match(reg)
    version = (v_info + '').replace(/[^0-9|_.]/gi, '').replace(/_/gi, '.') //得到版本号4.2.2
    version = parseInt(version.split('.')[0]) // 得到版本号第一位
  }
  console.log('version', version)
  return version
}

/**
 * 获取客户端信息
 */
function getClientInfo() {
  var userAgentInfo = navigator.userAgent
  var Agents = new Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod')
  var agentinfo = null
  for (var i = 0; i < Agents.length; i++) {
    if (userAgentInfo.indexOf(Agents[i]) > 0) {
      agentinfo = userAgentInfo
      break
    }
  }
  if (agentinfo) {
    return agentinfo
  } else {
    return 'PC'
  }
}

function getApiPrefix(api) {
  return '/' + api.split('/')[0].slice(2) + '/'
}

function getApiPath(api) {
  return api.slice(api.indexOf('/'))
}

function download(sn, _this) {
  if ((isWeixin() && isIos()) || getClientInfo() === 'PC') {
    if (isWeixin() && parseFloat(weixinVersion()) < 8.0) {
      Dialog.alert({ message: '微信版本过低，请升级微信', confirmButtonColor: this.colors.theme })
      return
    }
    _this.show = true
    let timestamp = Date.now(),
      hash = md5(timestamp + 'lfx')
    let src = `/madminapi/order/download?_responseType=blob&sn=${sn}`
    let oA = document.createElement('a')
    oA.href = src
    oA.click()
    _this.timer = setTimeout(() => {
      _this.show = false
      clearTimeout(_this.timer)
    }, 3000)
  } else {
    _this.$router.push({ name: 'guide', query: { src: `/madminapi/order/download?_responseType=blob&sn=${sn}` } })
  }
}

export {
  phoneValidator,
  idCardValidator,
  timeParser,
  addZero,
  filterArr,
  deepClone,
  thousands,
  wetherScroll,
  isIos,
  isWeixin,
  weixinVersion,
  timeParserWithHourMinutes,
  dateParser,
  getUserInfo,
  getApiPrefix,
  getApiPath,
  get_android_version,
  getClientInfo,
  download
}
