const validators = require('../src/server/validators');

describe('Validator tests', () => {
  test('Test completely invalid url', () => {
    const url = 'this.is.not.a.valid.url';
    const result = validators.checkUrl(url);
    expect(result).toBe(false);
  });
  test('Test url without protocol', () => {
    const url = 'www.test.com';
    const result = validators.checkUrl(url);
    expect(result).toBe(false);
  });
  test('Test valid url', () => {
    const url = 'https://www.test.com';
    const result = validators.checkUrl(url);
    expect(result).toBe(true);
  });
});

/*

toBe - primitive types
toEqual - compare content (objetcs, arrays, ...)

toBeNull
toBeFalsy

toBeLessThan
toBeLessThanOrEqual

toMatch
not.toMatch (regex)

toContain - element is in array
const usernames = ['John', 'Oliver', 'Admin'];
expext(usernames).ToContain('admin');


*/
