import { set, get, del, STORE_KEY } from '.';

function clearStorage() {
  window.localStorage.removeItem(STORE_KEY);
  window.sessionStorage.removeItem(STORE_KEY);
}

describe('storage', () => {
  beforeEach(() => {
    clearStorage();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('falls back to sessionStorage if localStorage is unavailable', () => {
    vi.spyOn(window, 'localStorage', 'get').mockReturnValue(undefined as unknown as Storage);
    window.sessionStorage.setItem(STORE_KEY, JSON.stringify({ key1: 'value1' }));
    expect(get('key1')).toBe('value1');
  });

  test('throws if neither storage is available', () => {
    vi.spyOn(window, 'localStorage', 'get').mockReturnValue(undefined as unknown as Storage);
    vi.spyOn(window, 'sessionStorage', 'get').mockReturnValue(undefined as unknown as Storage);
    expect(() => get('key1')).toThrow('Neither localStorage nor sessionStorage is available');
  });

  test('returns undefined if storage contains invalid JSON', () => {
    window.localStorage.setItem(STORE_KEY, '{invalid json}');
    expect(get('key1')).toBeUndefined();
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
