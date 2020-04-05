const config = require('../lib/config');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validators = require('./validators');
const debug = require('../lib/debug');
const endpoints = require('./endpoints');
const mockAPIResults = require('../lib/mockAPIResuls.js');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));

// Redirect root to static content
app.get('/', function(req, res) {
  res.sendFile(path.resolve('src/client/views/index.html'));
});

app.get('/destinationDetails', async (req, res) => {
  // Get parameters and replace whitespaces by + for city
  const city = req.query.city.replace(/\s/g, '+');
  const country = req.query.country;
  const countryCode = req.query.countryCode;
  const travelDate = Date.parse(req.query.travelDate) / 1000 + 86400;

  const timeDiff = Date.parse(req.query.travelDate) - Date.now();
  const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));

  let clientData = {
    country: country,
    city: city.replace(/\+/g, ' '),
    daysAway: dayDiff,
  };

  await endpoints.destinationCoordinates(city, countryCode)
      .then((coordinates) => clientData = {...clientData, ...coordinates});
  debug(clientData);

  await endpoints.destinationWeather(
      clientData.longitude,
      clientData.latitude,
      travelDate)
      .then((weather) => clientData = {...clientData, ...weather});
  debug(clientData);

  await endpoints.destinationPhotos(city)
      .then((photos) => clientData = {...clientData, ...photos});

  res.send(clientData);

  // Sample call: http://localhost:8081/destinationDetails?city=Wedel&country=DE
  // await endpoints.destinationCoordinates(city, country)
  //     .then((data) => res.send(data));

  // await endpoints.destinationWeather(9.698352813720703, 53.5837417752879)
  //     .then((data) => res.send(data));

  // await endpoints.destinationPhotos(city)
  //     .then((data) => res.send(data));
});

app.get('/countries', async (req, res) => {
  await endpoints.countries()
      .then((data) => res.send(data));
});

app.get('/test', async (req, res) => {
  const url = req.query.url;
  await endpoints.mockAPICall(url)
      .then((data) => res.send(data));
});

const analyzeText = (req, res) => {
  const url = req.query.url;

  if (!validators.checkUrl(url)) {
    const invalidUrlMessage = `The url ${url} is not valid`;
    debug(invalidUrlMessage);
    res.status(406).send(invalidUrlMessage);
    return;
  }
  res.send(mockAPIResults.validAndExistingUrl);
};
app.get('/analyzeText', analyzeText);

// designates what port the app will listen to for incoming requests
app.listen(config.serverPort, function() {
  console.log(`Travel App: Server listening on port ${config.serverPort}`);
});
