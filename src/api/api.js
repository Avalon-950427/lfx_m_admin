// 以__开头的api都是用以更改api前缀的，如__mapi的前缀就是mapi
const mapi = `__mapi`
export default {
  login: `/user/login`, // 登录请求
  getSMS: `${mapi}/sms/send`, // 获取短信验证码
  getIndex: '/', // 获取首页信息
  modifyAvatar: `${mapi}/user/avatar`, // 修改头像
  settingsMenu: '/user/settingsMenu', // 获取用户设置信息
  getStatisticList: '/product', // 获取统计列表信息
  getStageData: '/product/stageData', // 获取统计详情信息
  getUserStageData: '/user/stageData', // 获取用户阶段性统计数据
  getOrderList: '/order/list', // 获取订单列表
  getOrderDetail: '/order/detail', // 获取订单详情
  getRejectOrderList: '/order/rejectList', // 获取拒绝的订单列表
  changeOrder: '/order/update', // 修改订单状态
  downloadZip: '/order/download?_responseType=blob', // 下载压缩包
  downloadEmail: '/order/infoEmailSend', // 下载到邮箱
  logout: `${mapi}/user/logout`, // 退出登录
  update: '/user/update', // 修改短信通知开关
  aaa: 'xxx'
}
