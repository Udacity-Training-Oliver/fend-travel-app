const debug = require('../../lib/debug');
const mockAPIResults = require('../../lib/mockAPIResuls.js');

const clientMock = (url) => {
  try {
    let result = mockAPIResults.internalServerError;

    if (url.toLowerCase().includes('url-is-valid-and-exists')) {
      result = mockAPIResults.validAndExistingUrl;
    } else if (url.toLowerCase().includes('url-is-valid-and-not-exists')) {
      result = mockAPIResults.validButNotExistingUrl;
    } else if (url.toLowerCase().includes('url-is-invalid')) {
      result = mockAPIResults.invalidUrl;
    }
    return result;
  } catch (err) {
    debug(`ERROR: ${err}`);
  }
};

module.exports = clientMock;
