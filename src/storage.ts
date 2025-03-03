export const STORE_KEY = 'mt-link-javascript-sdk';

const localStorage = window.localStorage;

function getStorageObject(): { [key: string]: string } {
  const stringifiedData = localStorage.getItem(STORE_KEY) || '';
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

  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export function del(key: string): void {
  const data = getStorageObject();
  delete data[key];

  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export default {
  set,
  get,
  del
};
