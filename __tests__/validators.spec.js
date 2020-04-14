const validators = require('../src/server/validators');

describe('Validator tests', () => {
  test('Test query with required fields specified', () => {
    const query = {
      country: 'Germany',
      countryCode: 'DE',
      city: 'Hamburg',
      travelDate: '2020-08-03',
    };
    const result = validators.checkRequiredFields(query);
    expect(result).toBe(true);
  });
  test('Test query with required fields no completely specified', () => {
    const query = {
      country: 'Germany',
      countryCode: 'DE',
      travelDate: '2020-08-03',
    };
    const result = validators.checkRequiredFields(query);
    expect(result).toBe(false);
  });
  test('Test valid travel date', () => {
    const travelDate = '2020-08-03';
    const result = validators.isValidDate(travelDate);
    expect(result).toBe(true);
  });
  test('Test invalid travel date', () => {
    const travelDate = '2020-xx-03';
    const result = validators.isValidDate(travelDate);
    expect(result).toBe(false);
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
