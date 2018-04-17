const chalk = require('chalk');

function log(...args) {
  console.log();
  console.log(...args);
  console.log();
}

log.error = function(msg) {
  console.log();
  console.log(chalk.red(msg));
  console.log();
};

module.exports = log;
