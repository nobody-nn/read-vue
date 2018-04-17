const pkg = require('./package.json');
const hybridConfig = require('@alipay/hybrid-configuration');

// 离线包描述
const description = '芝麻信用';
// 离线包入口 html
const entryHtmlFilename = 'index.html';
// 离线包入口 url
const launchUrl = '/www/' + entryHtmlFilename;
// 离线包启动参数, 文档 http://site.alipay.net/iat/open-nebula/jsapi/startup-params.html
const launchParams = {
  url: launchUrl,
  readTitle: 'YES'
};
// 需要打包的文件
const include = ['./www/*.*'];
// 需要忽略的文件
const ignore = ['./www/*.md'];
// 启动模拟器后访问的 url
const port = pkg.scripts.dev.match(/\d{4,}/);
const simUrl = `http://localhost:${port}/` + entryHtmlFilename;

const qrcode = '';

// 在这里控制ios模拟器的相关信息,如支付宝版本,模拟器版本等
const alipaySim = hybridConfig.getPortal({
  appid: pkg.appid,
  url: simUrl,
  device: 'iPhone-8',
  os: '', // 不设定默认最新系统
  version: '10.1.8'
});
module.exports.simOpts = Object.assign({ qrcode }, alipaySim);

// open in safari
// const safariSim = {scheme: "http://127.0.0.1:8001"};
// module.exports.simOpts = Object.assign({ qrcode: qrcode}, safariSim);

// open in afwealth.app
const afwealthSim = hybridConfig.getAfwealth('http://m.baidu.com');
// module.exports.simOpts = Object.assign({qrcode: qrcode}, afwealthSim);

// open in taobao.app
const taobaoSim = hybridConfig.getTaobao('http://m.taobao.com');
// module.exports.simOpts = Object.assign({qrcode: qrcode}, taobaoSim);

module.exports.packages = {
  portal: {
    debug: alipaySim,
    deploy: 'nebula',
    container: 'AP',
    appid: pkg.appid,
    name: pkg.name,
    version: '1.0.0.1',
    description,
    launchParams,
    host: {
      enable: true,
      dev: `http://${pkg.appid}.h5app.alipay.net`,
      test: `https://${pkg.appid}.h5app.test.alipay.net`,
      online: `https://${pkg.appid}.h5app.alipay.com`
    },
    mapLocal: {
      'static.alipayobjects.com/publichome-static/antBridge': '/sdk'
    },
    build: {
      include,
      ignore
    },
    support: {
      ios: {
        minSDK: '0',
        maxSDK: '100',
        minOS: '9.6.10',
        maxOS: '100'
      },
      android: {
        minSDK: '0',
        maxSDK: '100',
        minOS: '9.6.10',
        maxOS: '100'
      }
    }
  },
  afwealth: {
    debug: afwealthSim,
    deploy: 'nebula',
    container: 'AF',
    appid: pkg.appid,
    name: pkg.name,
    version: '1.0',
    description,
    launchParams: {
      url: '/www/index.html'
    },
    host: {
      enable: true,
      dev: `http://${pkg.appid}.h5app.alipay.net`,
      test: `https://${pkg.appid}.test.h5app.alipay.net`,
      online: `https://${pkg.appid}.h5app.alipay.com`
    },
    mapLocal: {
      'static.alipayobjects.com/publichome-static/antBridge': '/sdk'
    },
    build: {
      include,
      ignore
    },
    support: {
      ios: {
        minSDK: '0',
        maxSDK: '100',
        minOS: '2.1.0',
        maxOS: '100'
      },
      android: {
        minSDK: '0',
        maxSDK: '100',
        minOS: '2.1.0',
        maxOS: '100'
      }
    }
  },
  taobao: {
    debug: taobaoSim,
    deploy: 'awp',
    container: 'taobao',
    appid: pkg.appid,
    name: pkg.name,
    version: '1.0.0.1',
    launchParams: {},
    support: {},
    build: {
      include,
      ignore
    }
  }
};
