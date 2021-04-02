module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['plugin:vue/essential', 'plugin:prettier/recommended', '@vue/prettier'],
  globals: {
    // 全局直用window.logs自定义函数
    logs: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {}
}
