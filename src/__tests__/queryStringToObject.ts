import { queryStringToObject } from '../helper';

describe('queryStringToObject', () => {
  it('transforms object to query string', () => {
    const queryString = 'key1=value1&key2=value2';

    expect(queryStringToObject(queryString)).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('casts boolean values to strings', () => {
    const queryString = 'true_key=true&false_key=false';

    expect(queryStringToObject(queryString)).toEqual({ true_key: 'true', false_key: 'false' });
  });

  it('ignores keys without values', () => {
    const queryString = 'defined_key=defined&undefined_key=';

    expect(queryStringToObject(queryString)).toEqual({ defined_key: 'defined' });
  });
});
