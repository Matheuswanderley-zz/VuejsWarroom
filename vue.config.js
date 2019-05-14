const path = require('path')

module.exports = {
  runtimeCompiler: false,
  transpileDependencies: [
    /\bvue-awesome\b/,
  ],
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': path.resolve('./node_modules/vue/dist/vue.common.js'),
      },
    },
  },
}