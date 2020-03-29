require('regenerator-runtime');

const formHandler = require('../src/client/js/formHandler');

describe('Client-side tests', () => {
  test('Test submit - Valid and existing url', async () => {
    expect.assertions(3);
    const res = await formHandler(undefined, 'https://www.url-is-valid-and-exists.com');
    expect(res.ok).toEqual(true);
    expect(res.polarity).toEqual('positive');
    expect(res.polarity_confidence).toEqual(0.67);
  });
  test('Test submit - Valid and not existing url', async () => {
    expect.assertions(1);
    const res = await formHandler(undefined, 'https://www.url-is-valid-and-not-exists.com');
    expect(res).toEqual('404: Not Found');
  });
  test('Test submit - Invalid url', async () => {
    expect.assertions(1);
    const res = await formHandler(undefined, 'www.url-is-invalid.com');
    expect(res).toEqual('406: Not Acceptable');
  });

  test('Test submit - Internal Server Error', async () => {
    expect.assertions(1);
    const res = await formHandler(undefined, 'https://www.provoke-internal-server-error.com');
    expect(res).toEqual('500: Internal Server Error');
  });
});
