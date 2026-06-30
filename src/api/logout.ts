import { getIsTabValue, openWindow } from '../helper';
import { StoredOptions, LogoutOptions } from '../typings';
import logoutUrl from './logout-url';

export default async function logout(storedOptions: StoredOptions, options: LogoutOptions = {}): Promise<void> {
  if (!window) {
    throw new Error(`[mt-link-sdk] \`logout\` only works in the browser.`);
  }

  const { isNewTab, ...restOptions } = options;

  openWindow(await logoutUrl(storedOptions, restOptions), getIsTabValue(isNewTab));
}
