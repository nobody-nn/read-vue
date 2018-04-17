const webpackMerge = require('webpack-merge');
const genZoroConfig = require('./webpack.config.base');

const genConfig = function(
  atoolConfig, // webpack config from atool-build
  options = {}
) {
  return genZoroConfig(
    webpackMerge(
      {
        // is webpack1
        webpack1: true,
        flatten: true,
        config: {
          // use atool's output
          output: atoolConfig.output
        }
      },
      options
    )
  );
};

module.exports = genConfig;
