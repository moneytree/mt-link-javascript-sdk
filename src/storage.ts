export const STORE_KEY = 'mt-link-javascript-sdk';

interface StorageData {
  [key: string]: string;
}

function getAvailableStorage(): Storage {
  if (typeof window.localStorage !== 'undefined' && window.localStorage !== null) return window.localStorage;

  // Fallback to sessionStorage
  if (typeof window.sessionStorage !== 'undefined' && window.sessionStorage !== null) return window.sessionStorage;

  throw new Error('Neither localStorage nor sessionStorage is available');
}

function getStorageObject(): StorageData {
  const storage = getAvailableStorage();

  try {
    const stringifiedData = storage.getItem(STORE_KEY);
    if (!stringifiedData) return {};

    return JSON.parse(stringifiedData);
  } catch (error) {
    throw new Error(`Failed to retrieve ${STORE_KEY} data from storage`);
  }
}

function saveStorageObject(data: StorageData): void {
  const storage = getAvailableStorage();

  try {
    storage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (error) {
    throw new Error('Failed to save data to storage');
  }
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
