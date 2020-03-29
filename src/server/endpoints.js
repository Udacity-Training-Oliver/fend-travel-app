require('regenerator-runtime');

const mockAPIResults = require('../lib/mockAPIResuls.js');

const endpoints = {
  mockAPICall: async (url) => {
    return new Promise((resolve, reject) => {
      resolve(mockAPIResults.validAndExistingUrl);
    });
  },
};

module.exports = endpoints;
