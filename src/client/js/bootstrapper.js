const config = require('../../lib/config');
const debug = require('../../lib/debug');

document.addEventListener('DOMContentLoaded', function(event) {
  getCountries().then(function(countries) {
    debug(countries);

    const selItems = new DocumentFragment();
    for (const country of countries) {
      const opt = document.createElement('option');
      opt.setAttribute('value', country.code);
      opt.textContent = country.name;
      selItems.appendChild(opt);
    }

    const selCountry = document.getElementById('sel-country');
    selCountry.appendChild(selItems);
  });
});

const getCountries = async () => {
  const url = `http://localhost:${config.serverPort}/countries`;
  const response = await fetch(url);
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    debug(`getCountries: ${error}`);
  }
};
