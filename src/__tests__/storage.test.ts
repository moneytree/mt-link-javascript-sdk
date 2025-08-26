import { set, get, del, STORE_KEY } from '../storage';

function clearStorage() {
  window.localStorage.removeItem(STORE_KEY);
  window.sessionStorage.removeItem(STORE_KEY);
}

describe('storage', () => {
  beforeEach(() => {
    clearStorage();
  });

  test('falls back to sessionStorage if localStorage is unavailable', () => {
    const originalLocalStorage = window.localStorage;
    // @ts-ignore, Suppress TypeScript error when deleting window.localStorage for test simulation.
    delete window.localStorage;
    window.sessionStorage.setItem(STORE_KEY, JSON.stringify({ key1: 'value1' }));
    expect(get('key1')).toBe('value1');
    window.localStorage = originalLocalStorage;
  });

  test('throws if neither storage is available', () => {
    const originalLocalStorage = window.localStorage;
    const originalSessionStorage = window.sessionStorage;
    // @ts-ignore, Suppress TypeScript error when deleting window.localStorage for test simulation.
    delete window.localStorage;
    // @ts-ignore, Suppress TypeScript error when deleting window.sessionStorage for test simulation.
    delete window.sessionStorage;
    expect(() => get('key1')).toThrow('Neither localStorage nor sessionStorage is available');
    window.localStorage = originalLocalStorage;
    window.sessionStorage = originalSessionStorage;
  });

  test('getStorageObject throws if storage contains invalid JSON', () => {
    window.localStorage.setItem(STORE_KEY, '{invalid json}');
    expect(() => get('key1')).toThrow('Failed to retrieve mt-link-javascript-sdk data from storage');
  });

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

  test('delete removes key', () => {
    set('key1', 'value1');
    expect(get('key1')).toBe('value1');
    del('key1');
    expect(get('key1')).toBeUndefined();
  });
});
