import { getIsTabValue, openWindow } from '../helper';
import { StoredOptions, LogoutOptions } from '../typings';
import logoutUrl from './logout-url';

export default function logout(storedOptions: StoredOptions, options: LogoutOptions = {}): void {
  if (!window) {
    throw new Error(`[mt-link-sdk] \`logout\` only works in the browser.`);
  }

  const { isNewTab, ...restOptions } = options;

  openWindow(logoutUrl(storedOptions, restOptions), getIsTabValue(isNewTab));
}
