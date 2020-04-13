const config = require('./config');
const debug = require('./debug');

let currentCountry = null; // e.g. {code: 'DE', name:m 'Germany'}

const countryHelper = {
  getCurrentCountry: () => {
    return currentCountry;
  },
  setCurrentCountry: (pCurrentCountry) => {
    currentCountry = pCurrentCountry;
  },
  getCountries: async () => {
    const url = `http://${config.serverName}:${config.serverPort}/countries`;
    const response = await fetch(url);
    try {
      const data = await response.json();
      return data;
    } catch (error) {
      debug(`getCountries: ${error}`);
    }
  },
  createCountryOptions: (countries) => {
    debug(countries);
    const options = new DocumentFragment();
    for (const country of countries) {
      const opt = document.createElement('option');
      opt.setAttribute('data-value', country.code);
      opt.setAttribute('value', country.name);
      options.appendChild(opt);
    }
    return options;
  },
};

document.addEventListener('DOMContentLoaded', async (event) => {
  countryHelper.getCountries().then(function(data) {
    const options = countryHelper.createCountryOptions(data);
    const datalistCountry = document.getElementById('countries');
    datalistCountry.appendChild(options);
  });
});

module.exports = countryHelper;
