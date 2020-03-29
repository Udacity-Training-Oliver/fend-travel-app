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
  pixabayBaseUrl: 'https://pixabay.com/api/?key={apikey}=yellow+flowers&image_type=photo&pretty=true',
};

const endpoints = {
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
  destinationCoordinates: async (city, country) =>{
    return new Promise(async (resolve, reject) => {
      const url = baseUrls.geonamesBaseUrl
          .replace(/{apikey}/g, apiKeys.geonamesApiKey)
          .replace(/{city}/g, city)
          .replace(/{country}/g, country);
      debug(`destinationCoordinates: ${url}`);

      const response = await fetch(url);

      try {
        const data = await response.json();
        resolve(data);
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
        resolve(data);
      } catch (error) {
        debug(`destinationCoordinates: ${error}`);
      }
    });
  },
};

module.exports = endpoints;
