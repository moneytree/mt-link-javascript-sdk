import { getIsTabValue, hasWindow, openWindow } from '../../helpers';
import { StoredOptions, LogoutOptions } from '../../typings';
import logoutUrl from './logout-url';

export default async function logout(storedOptions: StoredOptions, options: LogoutOptions = {}): Promise<void> {
  if (!hasWindow()) {
    throw new Error(`[mt-link-sdk] \`logout\` only works in the browser.`);
  }

  const { isNewTab, ...restOptions } = options;

  openWindow(await logoutUrl(storedOptions, restOptions), getIsTabValue(isNewTab));
}
