const config = require('../lib/config');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validators = require('./validators');
const dotenv = require('dotenv');

const debug = require('../lib/debug');
const endpoints = require('./endpoints');
const mockAPIResults = require('../lib/mockAPIResuls.js');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('dist'));

debug(__dirname);

// Read sensitive data (API KEYS) from .env
dotenv.config();

app.get('/', function(req, res) {
  res.sendFile(path.resolve('src/client/views/index.html'));
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
