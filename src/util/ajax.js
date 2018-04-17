// 文档 https://lark.alipay.com/zyy136807/grk76w/bdvpc7
import { rpcAjax as doAjax, trimPlainObj, call } from '@alipay/zm-h5-util';

function ajax(options = {}) {
  // 处理请求参数
  const { params, data, trim, ...moreArgs } = options;
  const ajaxOptions = { ...moreArgs };
  if (data) {
    ajaxOptions.data = trim ? trimPlainObj(data) : data;
  }
  if (params) {
    ajaxOptions.params = trim ? trimPlainObj(params) : data;
  }

  // 发送请求
  let hasResend = false;
  const send = () => {
    return doAjax(ajaxOptions).then(
      (json = {}) => {
        // 如果是 ajax 请求, 钱包有可能 session 丢失, 在这里统一处理 session 丢失的重发逻辑
        // TODO: 按需修改判断逻辑
        const shouldLogin = json.code === 'USER_NOT_LOGIN';
        if (shouldLogin && !hasResend) {
          hasResend = true;
          return call('login').then(() => {
            return send();
          });
        }
        // 处理服务器请求成功
        // TODO: 按需修改判断逻辑
        if (json.success === true || json.success === 'true') {
          return json.data || json;
        }
        // 处理服务器请求失败, 比如说: 通用错误提示, 或者会话失效后自动跳转到登录页面等等
        // 推荐 throw, 调用方能继续 catch 住 error, 然后根据不同的错误码进行不同的后续处理
        throw json;
      },
      (err = {}) => {
        // 其它通用错误处理, 比如说网络错误等等
        // TODO: 这里可以选择不 throw error
        throw err;
      }
    );
  };

  return send();
}

export default ajax;
