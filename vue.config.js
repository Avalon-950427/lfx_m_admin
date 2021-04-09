const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const path = require('path')
const fs = require('fs')
const pkg = require('./package.json')
const semver = require('semver')

// 开发或编译demo
const CompressionPlugin = require('compression-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const argArr = process.argv.slice(2)
const REM_ROOT_PX = 50

// webpack引用依赖
const externals = {
  vue: 'Vue',
  vuex: 'Vuex',
  'vue-router': 'VueRouter',
  lodash: '_',
  axios: 'axios',
  vant: 'vant'
}

// 外部资源配置
const cdn = {
  dev: {
    // css: ['https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css'],
    // js: []
  },
  prod: {
    css: ['https://cdn.jsdelivr.net/npm/vant@2.9.2/lib/index.css'],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.runtime.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.1.5/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
      'https://cdn.jsdelivr.net/npm/vant@2.9.2/lib/vant.min.js'
    ]
  }
}

// 编译lib库
if (argArr.indexOf('--target') > -1) {
  module.exports = {
    chainWebpack: (config) => {
      config.plugin('loadshReplace').use(new LodashModuleReplacementPlugin())
    },

    configureWebpack: {
      output: {
        libraryExport: 'default'
      },
      externals: externals,
      optimization: {
        minimize: true
      },
      plugins: [
        new BundleAnalyzerPlugin({
          analyzerPort: 8919
        })
      ]
    }
  }
  return
}

// 基础路径 注意发布之前要先修改这里
// 访问路径 http://localhost:8080/m
let version = pkg.version
let coreVersion = pkg.dependencies['rnjs-webapp'].replace('^', '')
const moduleName = 'madmin'
const routePath = `/${moduleName}/`
const publicPath = `/static/${moduleName}/`
const port = 17102
const netHost = `/madminapi/`
// const staticHost = `http://lfxdev.t.inxi.net`;
// const staticHost = `http://192.168.0.241:17102`;
const staticHost = `http://192.168.0.234:17102`
// const staticHost = `http://192.168.0.236:17102`

// 代理
const PROXY_TARGET = staticHost
const PROXY_PATHS = ['/libs', '/upload', '/static', '/socket.io', netHost, '/mapi']
const PROXY_TABLE = {}
PROXY_PATHS.map((key) => {
  PROXY_TABLE['^' + key] = {
    target: PROXY_TARGET,
    // ws: true, // 是否启用websockets
    changeOrigin: true,
    pathRewrite: {
      ['^' + key]: key
    }
  }
})

// 升级版本号
function upgradeVersion(dir = './') {
  let pkgText = fs.readFileSync(path.resolve(dir, './package.json'))
  let pkgObj = JSON.parse(pkgText)
  let pkgVer = semver.inc(pkgObj.version, 'patch')
  pkgObj.version = pkgVer
  let pkgText2 = JSON.stringify(pkgObj, true, 2)
  fs.writeFileSync(path.resolve(dir, 'package.json'), pkgText2)
  return pkgVer
}

// 设置环境JS
let headerHTML = null
let footerHTML = null
let EnvJS = null
const VUE_APP_VALIDATE = '{{VUE_APP_VALIDATE}}'
if (isProd) {
  version = upgradeVersion()
  EnvJS = ` var VUE_REM_ROOT = ${REM_ROOT_PX}; var VUE_APP_VERSION = '${coreVersion}+${version}'; var VUE_CUSTOMIZE = {
      vconsole: false,
      login: '/user/login'
    }; {{EnvJS | safe}}`
  headerHTML = '{{headerHTML | safe}}'
  footerHTML = '{{footerHTML | safe}}'
} else if (isDev) {
  EnvJS = `
    var VUE_APP_VALIDATE = false
    var VUE_APP_VERSION = '${coreVersion}+${version}';
    var VUE_APP_RESOURCE_BASE = '${publicPath}';
    var VUE_APP_ROUTER_BASE = '${routePath}';
    var VUE_APP_HTTP_BASE = '${netHost}';
    var VUE_APP_HTTP_OPTIONS = null;
    var VUE_REM_ROOT = ${REM_ROOT_PX};
    var VUE_CUSTOMIZE = {
      vconsole: true,
      login: '/user/login'
    }
  `
}

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  outputDir: 'dist',
  publicPath: publicPath,
  lintOnSave: true,
  runtimeCompiler: true,
  transpileDependencies: [],
  productionSourceMap: true,
  // productionSourceMap: process.env.NODE_ENV === 'dev',

  chainWebpack: (config) => {
    config
      .entry('main.js')
      .add('babel-polyfill')
      .end()
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@img', resolve('src/assets/img'))
      .set('@css', resolve('src/assets/styles/css'))
      .set('@scss', resolve('src/assets/styles/scss'))
    // cdn资源信息
    let cdnList = null
    if (isDev) {
      cdnList = cdn.dev
    } else {
      cdnList = cdn.prod
      // 删除预加载
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all'
      })
    }
    // 注入环境变量
    config.plugin('html').tap((args) => {
      args[0].EnvJS = EnvJS
      args[0].headerHTML = headerHTML
      args[0].footerHTML = footerHTML
      args[0].cdn = cdnList
      return args
    })
  },

  configureWebpack: (config) => {
    if (isProd) {
      // 用cdn方式引入
      config.externals = externals
      config.plugins.push(
        // 开启gzip压缩
        new CompressionPlugin({
          test: /\.js$|\.css/,
          threshold: 10240,
          deleteOriginalAssets: false
        })
      )
      if (argArr.indexOf('--analyze') !== -1) {
        config.plugins.push(
          // 打包结果分析
          new BundleAnalyzerPlugin({
            analyzerPort: 8919
          })
        )
      }
    }
  },

  css: {
    sourceMap: true,
    loaderOptions: {
      postcss: {
        plugins: [
          // flexible, 宽度为750px的设计图 37.5px = 1rem 如果css中不想转rem则用PX为单位
          // pxtorem({
          //   rootValue: REM_ROOT_PX,
          //   propList: ['*'],
          //   selectorBlackList: ['.ignore-']
          // }),
          autoprefixer()
        ]
      },
      less: {
        // 替换vant或UI框架的样式变量和方法
        modifyVars: {
          hack: `true;
          @import "${path.resolve(__dirname, './src/assets/css/mixin.less')}";
          @import "${path.resolve(__dirname, './src/assets/css/variable.less')}";
          `
        }
      }
    }
  },

  devServer: {
    // publicPath,
    proxy: {
      ...PROXY_TABLE,
      // '^/gauss': {
      //   target: 'https://gauss.shargoodata.com',
      //   changeOrigin: true
      // },
      '^/api/login': {
        target: PROXY_TARGET,
        changeOrigin: true
      }
    },
    disableHostCheck: true
  }
}
