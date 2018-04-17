const log = require('./log');

const config = {};

// 配置需要 mock 的 rpc 接口
// key 是 rpc 的 operationType
// value 是对应的数据文件的名字 (不带后缀), 数据文件统一存储在 './data' 目录下
const mockMap = {
  'alipay.mobile.foo': 'foo'
};

// 用户自定义 mock
config.call = {
  rpc(opts, callback) {
    const type = opts.operationType;
    const mockPath = mockMap[type];
    if (mockPath) {
      // 模拟服务端/网络接口延迟，此时会发现打了2次log，一次是纯请求的，一次是包含返回结果的
      setTimeout(() => {
        log(`delegate ${type} to \n${'./data/' + mockPath}`);
        // warning
        // do not modify the following line of code if you do not know what you are doing.
        // because webpack will load all the files under './data/' folder
        let res = require('./data/' + mockPath);
        if (typeof res === 'function') {
          res = res(opts);
        }
        callback && callback(res);
      }, 1000);
    }
  },
  toast(opts) {
    // 模拟客户端正在实现的一个新功能，这样可以在demo阶段前端自己进行mock，等客户端完成后业务代码无修改直接集成
    if (opts.type === 'a-new-type') {
      window.alert('mock:' + opts.content);
      return true;
    }
    // 返回false意味着调用客户端默认的实现
    return false;
  },
  getLocation(opts, callback) {
    // mock方法必有opts，callback两个参数。H5容器API中opts不传时，opts为undefined
    callback &&
      callback({
        province: '北京'
      });
  }
};

// 一般本地chrome开发时会打开此项配置，说明页面运行在一般的浏览器中，此时会自动mock一些容器API，触发AlipayJSBridgeReady事件，mock全局变量AlipayJSBridge
// 但是如果安装了luna-devtools，会自动识别到是在浏览器中运行，因此就不用打开了。
// 默认此项关闭，会通过UserAgent来猜测是否页面运行于Nebula中，如果页面运行在钱包容器中，不会自动mock，只会应用本配置文件中自定义的mock
// config.runInBrowser = true;

/**
 * 特殊需求：chrome中使用mock，模拟器和真机中不使用mock，但是想看到log
 *
// 自己的桌面浏览器可以在userAgent里设置一个特殊标示
if (navigator.userAgent.indexOf('runInDesktop') === -1) {
  // 关闭自定义接口，但是保留log
  for (var key in config.call) {
    config.call[key] = false;
  }
}
 */

// 完全禁用本工具，方便使用线上接口进行最后的验证。默认为false会开启所有mock
// config.forbidAll = true;

// 本工具默认会显示每次容器调用的log，如果想关掉请打开下面的配置（例如想使用debug.alipay.net来查看log）
// config.disableLog = true;

// 如果上面call中写的代码比较多，全部注释可能比较麻烦，可以单独配置为false来关闭自定义mock，此时会强制使用原生实现
// config.call.rpc = false; // 关闭对rpc接口的mock
// config.call.httpRequest = false; // 关闭对httpRequest接口的mock
// config.call.toast = false; // 关闭对toast接口的mock

// 仅对此列表之中的rpc进行mock，如果不配置此项默认会对所有rpc进行mock
config.rpcMockList = Object.keys(mockMap);

// 暂未实现
// config.startupParams = {
//   transparentTitle: 'always',
//   userId: '2088102118842421'
// }
// config.startupParams = false;

window.lunaMockConfig = config;
