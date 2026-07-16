import { objectToQueryString } from '../helper';

describe('objectToQueryString', () => {
  it('transforms object to query string', () => {
    const paramsObject = { key1: 'value1', key2: 'value2' };

    expect(objectToQueryString(paramsObject)).toEqual('key1=value1&key2=value2');
  });

  it('casts boolean values to strings', () => {
    const paramsObject = { true_key: true, false_key: false };

    expect(objectToQueryString(paramsObject)).toEqual('true_key=true&false_key=false');
  });

  it('ignores keys where values are undefined', () => {
    const paramsObject = { undefined_key: undefined, defined_key: 'defined' };

    expect(objectToQueryString(paramsObject)).toEqual('defined_key=defined');
  });

  it('ignores keys where values are null', () => {
    const paramsObject = { null_key: null, not_null_key: 'not_null' };

    expect(objectToQueryString(paramsObject)).toEqual('not_null_key=not_null');
  });
});
