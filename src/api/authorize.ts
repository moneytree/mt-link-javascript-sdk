import { getIsTabValue, openWindow } from '../helper';
import { StoredOptions, AuthorizeOptions } from '../typings';
import authorizeUrl from './authorize-url';

export default async function authorize(storedOptions: StoredOptions, options: AuthorizeOptions = {}): Promise<void> {
  if (!window) {
    throw new Error('[mt-link-sdk] `authorize` only works in the browser.');
  }

  const { isNewTab, ...restOptions } = options;

  openWindow(await authorizeUrl(storedOptions, restOptions), getIsTabValue(isNewTab));
}
