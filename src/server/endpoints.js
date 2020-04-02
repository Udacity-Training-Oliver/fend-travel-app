require('regenerator-runtime');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const debug = require('../lib/debug');
const mockAPIResults = require('../lib/mockAPIResuls.js');

// Read sensitive data (API KEYS) from .env
dotenv.config();
const apiKeys = {
  geonamesApiKey: process.env.GEONAMES_API_KEY,
  darkSkyApiKey: process.env.DARKSKY_API_KEY,
  pixabayApiKey: process.env.PIXABAY_API_KEY,
};

const baseUrls = {
  geonamesBaseUrl: 'http://api.geonames.org/postalCodeSearchJSON?placename={city}&country={country}&maxRows=1&username={apikey}',
  darkSkyBaseUrl: 'https://api.darksky.net/forecast/{apikey}/{latitude},{longitude}?exclude=hourly,flags',
  pixabayBaseUrl: 'https://pixabay.com/api/?key={apikey}&q={city}&image_type=photo&pretty=true',
  countryBaseUrl: 'http://country.io/names.json',
};

const endpoints = {
  // Mocked API calls
  mockAPICall: async (url) => {
    return new Promise((resolve, reject) => {
      resolve(mockAPIResults.validAndExistingUrl);
    });
  },
  destinationDetailsMock: async (city, country) =>{
    return new Promise((resolve, reject) => {
      resolve(mockAPIResults.geonamesSuccess);
    });
  },

  // Real API calls
  countries: async () => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(baseUrls.countryBaseUrl);
      try {
        const data = await response.json();
        const countries = [];
        for (const [key, value] of Object.entries(data)) {
          const country = {
            code: key,
            name: value,
          };
          countries.push(country);
        }
        countries.sort((a, b) => a.name > b.name ? 1 : -1);
        countries.unshift({name: '--- Select Country ---'});
        debug(countries);
        resolve(countries);
      } catch (error) {
        debug(`getCountryData: ${error}`);
      }
    });
  },
  destinationCoordinates: async (city, country) => {
    return new Promise(async (resolve, reject) => {
      const url = baseUrls.geonamesBaseUrl
          .replace(/{apikey}/g, apiKeys.geonamesApiKey)
          .replace(/{city}/g, city)
          .replace(/{country}/g, country);
      debug(`destinationCoordinates: ${url}`);

      const response = await fetch(url);

      try {
        const data = await response.json();
        const item = data.postalCodes[0];

        const coordinates = {
          country: item.countryCode,
          state: item.adminName1,
          province: item.adminName3,
          zip: item.postalCode,
          city: item.placeName,
          latitude: item.lat,
          longitude: item.lng,
        };

        // debug(coordinates);
        resolve(coordinates);
      } catch (error) {
        debug(`destinationCoordinates: ${error}`);
      }
    });
  },
  destinationWeather: async (longitude, latitude) => {
    return new Promise(async (resolve, reject) => {
      const url = baseUrls.darkSkyBaseUrl
          .replace(/{apikey}/g, apiKeys.darkSkyApiKey)
          .replace(/{latitude}/g, latitude)
          .replace(/{longitude}/g, longitude);
      debug(`destinationCoordinates: ${url}`);

      const response = await fetch(url);

      try {
        const data = await response.json();

        const currentWeather = data.currently;
        const forecastedWeather = data.daily.data;

        const weatherData = {
          weather: {
            current: {
              time: currentWeather.time,
              summary: currentWeather.summary,
              temperature: currentWeather.temperature,
              windSpeed: currentWeather.windSpeed,
            },
            forecast: [],
          },
        };

        for (const daily of forecastedWeather) {
          weatherData.weather.forecast.push({
            time: daily.time,
            iconName: daily.icon,
            summary: daily.summary,
            minTemperature: daily.temperatureLow,
            maxTemperature: daily.temperatureMax,
            windSpeed: daily.windSpeed,
          });
        }

        resolve(weatherData);
      } catch (error) {
        debug(`destinationCoordinates: ${error}`);
      }
    });
  },
  destinationPhotos: async (city) => {
    return new Promise(async (resolve, reject) => {
      const url = baseUrls.pixabayBaseUrl
          .replace(/{apikey}/g, apiKeys.pixabayApiKey)
          .replace(/{city}/g, city);
      debug(`destinationPhotos: ${url}`);

      const response = await fetch(url);

      try {
        const data = await response.json();
        const photos = data.hits;

        const photoData = {
          photos: [],
        };
        for (const photo of photos) {
          photoData.photos.push({
            tags: photo.tags,
            previewUrl: photo.previewURL,
            url: photo.webformatURL,
          });
        }

        resolve(photoData);
      } catch (error) {
        debug(`destinationPhotos: ${error}`);
      }
    });
  },
};

module.exports = endpoints;
