const qs = require('qs');

module.exports = config => {
  if (config.operationType) {
    // rpc
    const { operationType, requestData } = config;
    // log
    console.log(`mock for rpc ${operationType}`);
    console.log('request data');
    console.log(JSON.stringify(requestData, null, 2));
  } else {
    // ajax
    const { hostname, port, path, method, headers } = config;
    const query = qs.parse(path.split('?')[1] || '', {
      ignoreQueryPrefix: true
    });
    // log
    console.log(`mock for ajax [${method}] ${hostname}:${port}${path}`);
    console.log('request query');
    console.log(JSON.stringify(query, null, 2));
    console.log('request headers');
    console.log(JSON.stringify(headers, null, 2));
    console.log();
  }

  return {
    success: true,
    data: {
      bar: 'baz'
    }
  };
};
