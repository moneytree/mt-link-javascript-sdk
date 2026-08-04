import { makeUrlSafe } from '.';

describe('makeUrlSafe', () => {
  it('replaces "+" with "-"', () => {
    expect(makeUrlSafe('test+string')).toEqual('test-string');
  });

  it('replaces "/" with "_"', () => {
    expect(makeUrlSafe('test/string')).toEqual('test_string');
  });
});
