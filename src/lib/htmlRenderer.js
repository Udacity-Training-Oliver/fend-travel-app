const htmlRenderer = {

  /**
   * Compose the HTML for the client
   * @param {*} trip JSON object returned from the server
   * @return {string} HTML
   */
  getTripDetails: (trip) => {
    const weather = trip.weather;
    const result = `
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
    return result;
  },
  /**
   * Compose the HTML for the error message
   * @param {*} err Error message
   * @return {string} HTML
   */
  getError: (err) => {
    return `
      <h2>An error occured</h2>
      <p class='error-message'>
        ${err}
      </p>
    `;
  },
};

module.exports = htmlRenderer;
