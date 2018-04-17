const pkg = require('../package.json');
const axios = require('axios');
const internalIp = require('internal-ip');
const log = require('./log');

// 配置需要 mock 的 api 接口
// key 是 ajax 的 url
// value 是对应的数据文件的名字 (不带后缀), 数据文件统一存储在 './data' 目录下
const mockMap = {
  '/foo.json': 'foo'
};

// 代理项目的 .js/.css 的文件到本地服务器
const regFile = new RegExp(`(dist|www|(${pkg.name}\\/\\d+\\.\\d+\\.\\d+))`);
const extSet = new Set(['css', 'js']);
const ip = internalIp.v4.sync();
let port = pkg.scripts.dev.match(/\d{4,}/);
port = port ? port[0] : 8000;

module.exports = {
  summary: 'a rule to hack response',
  *beforeSendRequest(requestDetail) {
    // see http://anyproxy.io/cn/#beforesendrequest
    const { requestOptions } = requestDetail;
    let { path } = requestOptions;
    path = path.split('?')[0];
    // console.log(path);
    let body;

    const mockPath = mockMap[path];
    if (mockPath) {
      // 请求代理
      log(`delegate ${path} to \n${'./data/' + mockPath}`);
      try {
        body = require('./data/' + mockPath);
        if (typeof body === 'function') {
          body = body(requestOptions);
        }
        body = JSON.stringify(body);
      } catch (err) {
        log(`${mockMap} does not return valid json`);
      }
    } else if (regFile.test(path)) {
      // 文件代理
      const pathPartsArr = path.split('/');
      // file name
      let filename = pathPartsArr[pathPartsArr.length - 1];
      const namePartsArr = filename.split('.');
      // file ext
      const ext = namePartsArr[namePartsArr.length - 1];
      if (extSet.has(ext)) {
        // 处理 render 路径
        if (path.indexOf('www') !== -1) {
          filename = filename.replace(/-.+\./, '.');
        }
        const newUrl = `http://${ip}:${port}/${filename}`;

        log(`delegate ${path} to \n${newUrl}`);

        yield axios
          .get(newUrl)
          .then(obj => {
            body = obj.data;
          })
          .catch(err => {
            log.error(err.toString());
          });
      }
    }

    if (body) {
      requestDetail.response = {
        statusCode: 200,
        header: {},
        body
      };
    }
    return requestDetail;
  },
  *beforeSendResponse(requestDetail, responseDetail) {
    // see http://anyproxy.io/cn/#beforesendresponse
    if (requestDetail.url === 'http://httpbin.org/user-agent') {
      const newResponse = responseDetail.response;
      newResponse.body += '- AnyProxy Hacked!';

      yield new Promise(resolve => {
        setTimeout(() => {
          // delay
          resolve({ response: newResponse });
        }, 5000);
      });
    }
  },
  beforeDealHttpsRequest(requestDetail) {
    // see http://anyproxy.io/cn/#beforedealhttpsrequest
    return Promise.resolve(true);
  }
};
