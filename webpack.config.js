module.exports = function(atoolConfig) {
  const config = require('./script/webpack.config.zm')(atoolConfig, {
    // 是否开启 CommonsChunkPlugin, 抽取公共代码
    common: true,
    // 生产环境压缩混淆代码的时候, 是否移除 console
    dropConsole: false,
    // 是否在开发环境 (process.env.NODE_ENV === 'development') 开启 webpack 的 devtool
    devtool: true,
    // 是否开启 webpack 打包分析, 会在 dist 目录生成 report.html, 打开即可看到打包详情
    analyse: true,
    // 额外的配置, 会被 merge 到最终的 webpack config
    config: {
      // 在这里设置 entry
      entry: {
        home: './src/module/home/home'
      }
    }
  });

  // console.log(JSON.stringify(config, null, 4));

  return config;
};
