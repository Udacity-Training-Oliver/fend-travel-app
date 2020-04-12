const config = require('../../lib/config');
const debug = require('../../lib/debug');
const countryHelper = require('../../lib/country');
const weatherHelper = require('../../lib/weather');
const clientMock = require('./clientMock');

// Variables
let currentCountry = null;
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
      <li>${data.country}</li>
      <li>${data.city}</li>
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
const searchTrip = async (url, useMock) => {
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

  // TODO remove debug assignment
  currentCountryCode = currentCountryCode || 'FR';

  debug(`country: ${currentCountryCode}`);
  debug(`city: ${city}`);
  debug(`travelDate: ${travelDate}`);

  let mockResult = '';
  await searchTrip(`http://${config.serverName}:${config.serverPort}/destinationDetails/?country=${currentCountry}&countryCode=${currentCountryCode}&city=${city}&travelDate=${travelDate}`, useMock)
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

          const weather = res.weather;
          const weatherIcon = document.getElementById('weather-icon');
          if (!weather.iconName) {
            weather.iconName = 'no-weather-info';
          }
          const altWeatherText = weather.iconName.replace(/-/g, ' ');
          debug(weather.iconName);
          weatherIcon.src = weatherHelper.getIcon(weather.iconName);
          weatherIcon.alt = altWeatherText;
          weatherIcon.title = altWeatherText;

          const photos = new DocumentFragment();
          for (const photo of res.photos) {
            const image = document.createElement('img');
            image.setAttribute('class', 'photo');
            image.setAttribute('src', photo.url);
            image.setAttribute('title', photo.tags);
            image.setAttribute('alt', photo.tags);
            photos.appendChild(image);
          }
          const locationPhotos = document.getElementById('location-photos');
          locationPhotos.innerHTML = '';
          locationPhotos.appendChild(photos);
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

document.addEventListener('DOMContentLoaded', async (event) => {
  countryHelper.getCountries().then(function(data) {
    // countries = data;
    const options = countryHelper.createCountryOptions(data);
    const datalistCountry = document.getElementById('countries');
    datalistCountry.appendChild(options);
  });
});

document.getElementById('country').addEventListener('change', (event) => {
  debug(`Country before: ${currentCountryCode}`);
  const currentCountryName = event.srcElement.value;
  const currentCountryOption = document
      .querySelector(`#countries option[value='${currentCountryName}']`);
  currentCountry = currentCountryOption.value;
  currentCountryCode = currentCountryOption.dataset.value;
  debug(`Country after ${currentCountryCode}`);

  document.getElementById('city').value = null;
});

export default handleSubmit;
