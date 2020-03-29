const endpoints = require('../src/server/endpoints');

describe('Endpoint tests', () => {
  test('Test mock API with promise', () => {
    expect.assertions(1);
    return endpoints.mockAPICall()
        .then((data) => {
          expect(data.title).toEqual('test json response');
        });
  });
  test('Test mock API with async/await', async () => {
    expect.assertions(1);
    const data = await endpoints.mockAPICall();
    expect(data.title).toEqual('test json response');
  });
});
