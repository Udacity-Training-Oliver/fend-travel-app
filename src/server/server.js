const config = require('../lib/config');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validators = require('./validators');
const dotenv = require('dotenv');
const AylienTextApi = require('aylien_textapi');

const debug = require('../lib/debug');
const endpoints = require('./endpoints');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('dist'));

debug(__dirname);

dotenv.config();
const aylienTextApi = new AylienTextApi({
  application_id: process.env.API_ID,
  application_key: process.env.API_KEY,
});

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

  // Analyze text of URL
  aylienTextApi.sentiment({
    url: url,
  }, function(error, response) {
    if (error) {
      debug(error.message);
      res.status(404).send(error.message);
    } else {
      debug(response);
      res.send(response);
    }
  });
};
app.get('/analyzeText', analyzeText);

// designates what port the app will listen to for incoming requests
app.listen(config.serverPort, function() {
  console.log(`Travel App: Server backend listening on port ${config.serverPort}`);
});
