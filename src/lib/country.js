const config = require('./config');
const debug = require('./debug');

const countryHelper = {
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

module.exports = countryHelper;
