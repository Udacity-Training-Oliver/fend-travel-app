const config = require('../../lib/config');
const debug = require('../../lib/debug');
const countryHelper = require('../../lib/country');
const weatherHelper = require('../../lib/weather');
const clientMock = require('./clientMock');

/**
 * Compose the HTML for the client
 * @param {*} trip JSON object returned from the server
 * @return {string} HTML
 */
const getTripDetailsHtml = (trip) => {
  const weather = trip.weather;

  return `
    <h2>
      My trip to: ${trip.city}, ${trip.country}
    </h2>
    <h2>
      Departing: ${new Date(weather.time).toLocaleDateString()}
    </h2>

    <input type="button" value="Save Trip">
    <input type="button" value="Remove Trip">

    <div>
      <p>
        ${trip.city}, ${trip.country} is ${trip.daysAway} days away.
      </p>
    </div>

    <div class="weather-info">
      <p>
        Typical weather for then is:<br>
        High ${weather.maxTemperature}, low ${weather.minTemperature}
      </p>
      <p>${weather.summary || 'no weather details'}</p>
      <img class="weather-icon">
    </div>
  `;
};

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
  countryHelper.setCurrentCountry(
      countryHelper.getCurrentCountry() || {
        name: 'France',
        code: 'FR',
      });

  debug(`country: ${JSON.stringify(countryHelper.getCurrentCountry())}`);
  debug(`city: ${city}`);
  debug(`travelDate: ${travelDate}`);

  let mockResult = '';

  const url = `http://${config.serverName}:${config.serverPort}/destinationDetails/?` +
    `country=${countryHelper.getCurrentCountry().name}&` +
    `countryCode=${countryHelper.getCurrentCountry().code}&` +
    `city=${city}&travelDate=${travelDate}`;

  debug(url);
  await searchTrip(url, useMock)
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
          document.getElementById('trip-details')
              .innerHTML = getTripDetailsHtml(res);
          styleWeatherIcon(res.weather);
          addPhotos(res.photos);
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
