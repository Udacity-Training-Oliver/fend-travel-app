const config = require('../../lib/config');
const debug = require('../../lib/debug');
const clientMock = require('./clientMock');

let countries = null;
let currentCountryCode = null;

/**
 * Compose the HTML for the client
 * @param {*} data JSON object returned from the server
 * @return {string} HTML
 */
const getResponseHtml = (data) => {
  const weather = data.weather;

  return `
    <h2>Response from API</h2>
    <ul>
      <li>${weather.time}</li>
      <li>${data.daysAway}</li>
      <li>icon: ${weather.iconName}</li>
      <li>${weather.summary}</li>
      <li>${weather.minTemperature}</li>
      <li>${weather.maxTemperature}</li>
    </ul>
  `;
};

/**
 * Compose error message
 * @param {*} data JSON error object
 * @return {string} Error messsage
 */
const createErrorMessage = (data) => {
  return `${data.status}: ${data.statusText}`;
};

/**
 * Compose the HTML for the error message
 * @param {*} err Error message
 * @return {string} HTML
 */
const getErrorHtml = (err) => {
  return `
    <h2>An error occured</h2>
    <p>${err}</p>
  `;
};

/**
 * Analyze the text behind an url which will be passed as a parameter.
 * It can also controlles via the useMock-flag whether the real service
 * should be called or a mock should be used. The latter case is used
 * for automated tests with Jest.
 *
 * @param {string} url Location to analyze the text from
 * @param {bool} useMock Mock vs real service call
 */
const callAnalyzeText = async (url, useMock) => {
  return useMock ? new Promise((resolve, reject) => {
    resolve(clientMock(url));
  }) : fetch(url);
};


/**
 * Handle submit event from form
 * @param {*} event
 * @param {*} mockUrlToAnalyze
 * @return {*} response, only relevant for mocking
 */
const handleSubmit = async (event, mockUrlToAnalyze) => {
  debug(`Event: ${event}`);
  debug(`MockUrlToAnalyze: ${mockUrlToAnalyze}`);

  if (event) {
    event.preventDefault();
  }

  const useMock = mockUrlToAnalyze != undefined;

  const city = document.getElementById('city').value;
  const travelDate = document.getElementById('travel-date').value;

  debug(`country: ${currentCountryCode}`);
  debug(`city: ${city}`);
  debug(`travelDate: ${travelDate}`);

  let mockResult = '';
  await callAnalyzeText(`http://${config.serverName}:${config.serverPort}/destinationDetails/?country=${currentCountryCode}&city=${city}&travelDate=${travelDate}`, useMock)
      // Process response from service (or mock, if applicable)
      .then((res) => {
        if (!res.ok) {
          debug(res);
          const errorMessage = createErrorMessage(res);
          throw errorMessage;
        }
        return useMock ? res : res.json();
      })
      // Prepare HTML to show as response
      .then((res) => {
        debug(`returned from server: ${JSON.stringify(res)}`);
        if (useMock) {
          mockResult = res;
        } else {
          document.getElementById('results').innerHTML = getResponseHtml(res);

          document.getElementById('travel-details');
        }
      })
      // Error handling in case that something went wrong
      .catch((err) => {
        if (useMock) {
          mockResult = err;
        } else {
          document.getElementById('results').innerHTML = getErrorHtml(err);
        }
      });
  if (useMock) {
    return mockResult;
  }
};

document.addEventListener('DOMContentLoaded', (event) => {
  getCountries().then(function(data) {
    countries = data;
    debug(countries);

    const options = new DocumentFragment();
    for (const country of countries) {
      const opt = document.createElement('option');
      opt.setAttribute('data-value', country.code);
      opt.setAttribute('value', country.name);
      options.appendChild(opt);
    }

    const datalistCountry = document.getElementById('countries');
    datalistCountry.appendChild(options);
  });
});

document.getElementById('country').addEventListener('change', (event) => {
  debug(`Country before: ${currentCountryCode}`);
  const currentCountryName = event.srcElement.value;
  const currentCountryOption = document
      .querySelector(`#countries option[value='${currentCountryName}']`);
  currentCountryCode = currentCountryOption.dataset.value;
  debug(`Country after ${currentCountryCode}`);

  document.getElementById('city').value = null;
});

const getCountries = async () => {
  const url = `http://${config.serverName}:${config.serverPort}/countries`;
  const response = await fetch(url);
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    debug(`getCountries: ${error}`);
  }
};

module.exports = handleSubmit;
