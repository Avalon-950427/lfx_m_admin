// 获取 VUE_APP_ENV 非 NODE_ENV，测试环境依然 console
const isProd = ['production', 'prod'].includes(process.env.VUE_APP_ENV)
const plugins = [
  [
    'import',
    {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: (name) => `${name}/style/less`
    },
    'vant'
  ]
]
// 移除console.log，必要时可用window.logs(123)
if (isProd) {
  plugins.push('lodash')
  plugins.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins
}
