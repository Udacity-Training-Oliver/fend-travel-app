require('regenerator-runtime');

const htmlRenderer = require('../src/lib/htmlRenderer');

describe('Client-side tests', () => {
  test('Render trip details', () => {
    expect.assertions(1);

    const trip = {
      'country': 'France',
      'countryCode': 'FR',
      'city': 'Paris',
      'daysAway': 110,
      'ok': true,
      'status': 200,
      'statusText': 'OK',
      'state': 'Île-de-France',
      'province': 'Paris',
      'zip': '75001',
      'latitude': 48.8592,
      'longitude': 2.3417,
      'weather': {
        'time': '2020-08-03',
        'iconName': 'partly-cloudy-day',
        'summary': 'Partly cloudy throughout the day.',
        'minTemperature': 18,
        'maxTemperature': 24,
        'windSpeed': 10.76,
      },
    };

    const res = htmlRenderer.getTripDetails(trip);

    const expected = `
      <h2>
        My trip to: Paris, France
      </h2>
      <h2>
        Departing: 8/3/2020
      </h2>

      <input type="button" value="Save Trip">
      <input type="button" value="Remove Trip">

      <div>
        <p>
          Paris, France is 110 days away.
        </p>
      </div>

      <div class="weather-info">
        <p>
          Typical weather for then is:<br>
          High 24, low 18
        </p>
        <p>Partly cloudy throughout the day.</p>
        <img class="weather-icon">
      </div>
    `;

    expect(res).toEqual(expected);
  });

  test('Render trip details', () => {
    expect.assertions(1);

    const err = '400: Bad Request (country, city and date are required)';

    const res = htmlRenderer.getError(err);

    const expected = `
      <h2>An error occured</h2>
      <p class='error-message'>
        400: Bad Request (country, city and date are required)
      </p>
    `;

    expect(res).toEqual(expected);
  });
});
