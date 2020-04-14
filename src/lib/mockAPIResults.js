const mockAPIData = require('./mockAPIResultData.json');
const mockCoordinatesData = require('./mockCoordinatesData.json');
const mockWeatherData = require('./mockWeatherData.json');
const mockPhotoData = require('./mockPhotoData.json');

const mockAPIResults = {
  successfulAPICall: mockAPIData,
  destinationCoordinates: mockCoordinatesData,
  destinationWeather: mockWeatherData,
  destinationPhotos: mockPhotoData,
  internalServerError: {
    'ok': false,
    'status': 500,
    'statusText': 'Internal Server Error',
  },
};

module.exports = mockAPIResults;
