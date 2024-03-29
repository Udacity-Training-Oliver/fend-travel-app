require('regenerator-runtime');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const debug = require('../lib/debug');
const mockAPIResults = require('../lib/mockAPIResults.js');

// Read sensitive data (API KEYS) from .env
dotenv.config();
const apiKeys = {
  geonamesApiKey: process.env.GEONAMES_API_KEY,
  darkSkyApiKey: process.env.DARKSKY_API_KEY,
  pixabayApiKey: process.env.PIXABAY_API_KEY,
};

const baseUrls = {
  geonamesBaseUrl: 'http://api.geonames.org/postalCodeSearchJSON?placename={city}&country={country}&maxRows=1&username={apikey}',
  darkSkyBaseUrl: 'https://api.darksky.net/forecast/{apikey}/{latitude},{longitude},{travelDate}?exclude=currently,hourly,flags&units=ca',
  pixabayBaseUrl: 'https://pixabay.com/api/?key={apikey}&q={city}&image_type=photo&pretty=true',
  countryBaseUrl: 'http://country.io/names.json',
};

const endpoints = {
  // Mocked API calls
  destinationCoordinatesMock: async (city, country) =>{
    return new Promise((resolve, reject) => {
      resolve(mockAPIResults.destinationCoordinates);
    });
  },
  destinationWeatherMock: async (longitude, latitude, travelDate) =>{
    return new Promise((resolve, reject) => {
      resolve(mockAPIResults.destinationWeather);
    });
  },
  destinationPhotoDataMock: async (city) =>{
    return new Promise((resolve, reject) => {
      resolve(mockAPIResults.destinationPhotos);
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

        if (data.postalCodes.length) {
          const item = data.postalCodes[0];

          const coordinates = {
            ok: true,
            status: 200,
            statusText: 'OK',
            state: item.adminName1,
            province: item.adminName3,
            zip: item.postalCode,
            // was set before city: item.placeName,
            latitude: item.lat,
            longitude: item.lng,
          };
          resolve(coordinates);
        } else {
          const notFound = {
            ok: false,
            status: 404,
            statusText: 'Not found (invalid country/city-combination)',
          };
          resolve(notFound);
        }
      } catch (error) {
        debug(`destinationCoordinates: ${error}`);
      }
    });
  },
  destinationWeather: async (longitude, latitude, travelDate) => {
    return new Promise(async (resolve, reject) => {
      const url = baseUrls.darkSkyBaseUrl
          .replace(/{apikey}/g, apiKeys.darkSkyApiKey)
          .replace(/{latitude}/g, latitude)
          .replace(/{travelDate}/g, travelDate)
          .replace(/{longitude}/g, longitude);
      debug(`destinationCoordinates: ${url}`);

      const response = await fetch(url);

      try {
        const data = await response.json();
        const day = data.daily.data[0];
        const weatherData = {
          weather: {
            time: new Date(day.time*1000).toISOString().split('T')[0],
            iconName: day.icon,
            summary: day.summary,
            minTemperature: Math.round(day.temperatureLow),
            maxTemperature: Math.round(day.temperatureMax),
            windSpeed: day.windSpeed,
          },
        };

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
