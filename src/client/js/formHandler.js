const config = require('../../lib/config');
const debug = require('../../lib/debug');
const clientMock = require('./clientMock');

/**
 * Compose the HTML for the client
 * @param {*} data JSON object returned from the server
 * @return {string} HTML
 */
const getResponseHtml = (data) => {
  return `
    <h2>Response from API</h2>
    <ul>
        <li>${data.polarity} (${data.polarity_confidence})</li>
        <li>${data.subjectivity} (${data.subjectivity_confidence})</li>
    </ul>
    <h2>Text behind the link</h2>
    <p>
      ${data.text.replace(/\n*\n/g, '<br>')}
    </p>
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
const callAnalyzeText = async (url, useMock) => {
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
  const urlToAnalyze = mockUrlToAnalyze || document.getElementById('url').value;
  debug(`urlToAnalyze: ${urlToAnalyze}`);

  let mockResult = '';
  await callAnalyzeText(`http://${config.serverName}:${config.serverPort}/analyzeText/?url=${urlToAnalyze}`, useMock)
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

module.exports = handleSubmit;
