export const STORE_KEY = 'mt-link-javascript-sdk';

interface StorageData {
  [key: string]: string;
}

function isStorageAvailable(storage: Storage): boolean {
  try {
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch (_) {
    return false;
  }
}

function getAvailableStorage(): Storage {
  if (isStorageAvailable(window.localStorage)) return window.localStorage;

  if (isStorageAvailable(window.sessionStorage)) {
    console.error('localStorage not available, falling back to sessionStorage');
    return window.sessionStorage;
  }

  throw new Error('Neither localStorage nor sessionStorage is available');
}

function getStorageObject(): StorageData {
  const storage = getAvailableStorage();

  try {
    const stringifiedData = storage.getItem(STORE_KEY);
    if (!stringifiedData) return {};

    return JSON.parse(stringifiedData);
  } catch (error) {
    console.error(`Failed to load or parse data from storage key "${STORE_KEY}":`, error);
    return {};
  }
}

function saveStorageObject(data: StorageData): void {
  const storage = getAvailableStorage();
  storage.setItem(STORE_KEY, JSON.stringify(data));
}

export function get(key: string): string | undefined {
  return getStorageObject()[key];
}

export function set(key: string, value: string): void {
  const data = getStorageObject();
  data[key] = value;

  saveStorageObject(data);
}

export function del(key: string): void {
  const data = getStorageObject();
  delete data[key];

  saveStorageObject(data);
}

export default {
  set,
  get,
  del
};
