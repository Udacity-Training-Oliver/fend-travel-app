const mockAPIData = require('./mockAPIResultData.json');

const mockAPIResults = {
  successfulAPICall: mockAPIData,
  internalServerError: {
    'ok': false,
    'status': 500,
    'statusText': 'Internal Server Error',
  },
};

module.exports = mockAPIResults;
