const debug = require('../../lib/debug');
const mockAPIResults = require('../../lib/mockAPIResults.js');

const clientMock = (url) => {
  try {
    let result = mockAPIResults.internalServerError;
    result = mockAPIResults.successfulAPICall;
    return result;
  } catch (err) {
    debug(`ERROR: ${err}`);
  }
};

module.exports = clientMock;
