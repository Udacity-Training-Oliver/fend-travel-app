const endpoints = require('../src/server/endpoints');

describe('Endpoint tests', () => {
  test('Test coordinates API with promise', () => {
    expect.assertions(1);
    return endpoints.destinationCoordinatesMock('Wedel', 'DE')
        .then((data) => {
          expect(data.postalCodes[0].postalCode).toEqual('22880');
        });
  });
  test('Test coordinates API with async/await', async () => {
    expect.assertions(1);
    const data = await endpoints.destinationCoordinatesMock('Wedel', 'DE');
    expect(data.postalCodes[0].postalCode).toEqual('22880');
  });
  test('Test weather API with async/await', async () => {
    expect.assertions(1);

    const data = await endpoints.destinationWeatherMock(
        48.8592, 2.3417, '2020-08-03', 'DE');

    expect(data.daily.data[0].summary)
        .toEqual('Partly cloudy throughout the day.');
  });
  test('Test photo API with async/await', async () => {
    expect.assertions(1);
    const data = await endpoints.destinationPhotoDataMock('Paris');
    expect(data.hits[0].tags).toEqual('louvre, pyramid, paris');
  });
});
