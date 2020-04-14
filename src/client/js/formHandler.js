const config = require('../../lib/config');
const debug = require('../../lib/debug');
const countryHelper = require('../../lib/country');
const weatherHelper = require('../../lib/weather');
const htmlRenderer = require('../../lib/htmlRenderer');
const clientMock = require('./clientMock');

/**
 * Style weather icon with alternate text and title
 * and add placeholder in case that no weather details
 * have been provided by the API
 * @param {*} weather JSON weather object
 */
const styleWeatherIcon = (weather) => {
  const weatherIcon = document.querySelector('.weather-icon');
  if (!weather.iconName) {
    weather.iconName = 'no-weather-info';
  }
  const altWeatherText = weather.iconName.replace(/-/g, ' ');
  debug(weather.iconName);
  weatherIcon.src = weatherHelper.getIcon(weather.iconName);
  weatherIcon.alt = altWeatherText;
  weatherIcon.title = altWeatherText;
};

/**
 * Remove existing photos and add new ones as they
 * have been passed as parameter
 * @param {*} photos JSON photo object-array
 */
const addPhotos = (photos) => {
  const photoFragment = new DocumentFragment();
  for (const photo of photos) {
    const image = document.createElement('img');
    image.setAttribute('class', 'photo');
    image.setAttribute('src', photo.url);
    image.setAttribute('title', photo.tags);
    image.setAttribute('alt', photo.tags);
    photoFragment.appendChild(image);
  }
  const locationPhotos = document.getElementById('location-photos');
  locationPhotos.innerHTML = '';
  locationPhotos.appendChild(photoFragment);
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
 * Search trip, can be used with the real service or a mock call,
 * configuration takes place in config.js
 *
 * @param {string} url Location to analyze the text from
 */
const searchTrip = async (url) => {
  return config.useMock ? new Promise((resolve, reject) => {
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

  const city = document.getElementById('city').value;
  const travelDate = document.getElementById('travel-date').value;

  // Debug assignment to save time when testing
  //
  // countryHelper.setCurrentCountry(
  //     countryHelper.getCurrentCountry() || {
  //       name: 'France',
  //       code: 'FR',
  //     });

  debug(`country: ${JSON.stringify(countryHelper.getCurrentCountry())}`);
  debug(`city: ${city}`);
  debug(`travelDate: ${travelDate}`);

  const url = `http://${config.serverName}:${config.serverPort}/destinationDetails/?` +
    `country=${countryHelper.getCurrentCountry().name}&` +
    `countryCode=${countryHelper.getCurrentCountry().code}&` +
    `city=${city}&travelDate=${travelDate}`;

  debug(url);

  let mockResult = null;
  await searchTrip(url)
      // Process response from service (or mock, if applicable)
      .then((res) => {
        const result = config.useMock ? res : res.json();
        debug(result);
        return result;
      })
      // Prepare HTML to show as response
      .then((res) => {
        debug(`returned from server: ${JSON.stringify(res)}`);

        // Error handling
        if (!res.ok) {
          const errorMessage = createErrorMessage(res);
          throw errorMessage;
        }

        // Render trip details
        document.getElementById('trip-details')
            .innerHTML = htmlRenderer.getTripDetails(res);
        styleWeatherIcon(res.weather);
        addPhotos(res.photos);
        mockResult = res;
      })
      // Error handling in case that something went wrong
      .catch((err) => {
        const locationPhotos = document.getElementById('location-photos');
        locationPhotos.innerHTML = '';
        document.getElementById('trip-details').innerHTML =
          htmlRenderer.getError(err);
      });

  if (config.useMock) {
    return mockResult;
  }
};

/**
 * Event listener when a country-selection has been taken place.
 * After selecting a new country the city field will always be emptied.
 */
document.getElementById('country').addEventListener('change', (event) => {
  debug(`Country before: ${JSON.stringify(countryHelper.getCurrentCountry())}`);

  // Read the country from the selected option and update current country
  const currentCountryName = event.srcElement.value;
  const currentCountryOption = document
      .querySelector(`#countries option[value='${currentCountryName}']`);
  countryHelper.setCurrentCountry({
    name: currentCountryOption.value,
    code: currentCountryOption.dataset.value,
  });

  debug(`Country after ${JSON.stringify(countryHelper.getCurrentCountry())}`);

  // Empty city field after country-change
  document.getElementById('city').value = null;
});

export default handleSubmit;
