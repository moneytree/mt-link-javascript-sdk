export const STORE_KEY = 'mt-link-javascript-sdk';

const sessionStorage = window.sessionStorage;

function getStorageObject(): { [key: string]: string } {
  const stringifiedData = sessionStorage.getItem(STORE_KEY) || '';
  let data = {};

  try {
    data = JSON.parse(stringifiedData);
  } catch (error) {
    data = {};
  }

  return data;
}

export function get(key: string): string | undefined {
  return getStorageObject()[key];
}

export function set(key: string, value: string): void {
  const data = getStorageObject();
  data[key] = value;

  sessionStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export default {
  set,
  get
};
