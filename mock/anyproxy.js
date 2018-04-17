const watch = require('watch');
const execa = require('execa');

let anyproxyProcess;
const startAnyproxy = () => {
  if (anyproxyProcess) {
    console.log('stop anyproxy');
    anyproxyProcess.kill('SIGINT');
    anyproxyProcess = undefined;
  }
  if (!anyproxyProcess) {
    console.log('start anyproxy');
    anyproxyProcess = execa.shell(
      'anyproxy --rule ./mock/anyproxy.config.js --port 6001 --web 6002',
      {
        stdio: 'inherit'
      }
    );
  }
};

watch.watchTree(
  __dirname,
  {
    // Specifies the interval duration in seconds, the time period between polling for file changes.
    interval: 3,
    ignoreDotFiles: true,
    ignoreUnreadableDir: true,
    ignoreNotPermitted: true
  },
  startAnyproxy
);
