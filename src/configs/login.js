const fields = {
  tel: {
    type: 'number',
    value: '',
    placeholder: '请输入您的手机号',
    align: 'left',
    maxlength: 11,
    require: true
  },
  smscode: {
    type: 'number',
    value: '',
    placeholder: '请输入短信验证码',
    align: 'left',
    maxlength: 6,
    ref: 'smscode',
    button: '获取验证码',
    require: true
  }
}

export { fields }
