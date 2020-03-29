const config = require('./config');
/**
 * Write debug information, e.g. by logging output to console
 * @param {*} output
 */
function debug(output) {
  if (config.enableDebugInfo) {
    console.log(output);
  }
};

module.exports = debug;
