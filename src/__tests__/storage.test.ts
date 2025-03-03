import { set, get, STORE_KEY } from '../storage';

describe('storage', () => {
  test('set, get', () => {
    expect(get('key1')).toBeUndefined();

    set('key1', 'value1');

    expect(get('key1')).toBe('value1');
  });

  test('get with invalid existing storage value', () => {
    window.localStorage.setItem(STORE_KEY, '"abc"');

    expect(get('key1')).toBeUndefined();

    window.localStorage.setItem(STORE_KEY, '');

    expect(get('key1')).toBeUndefined();
  });
});
