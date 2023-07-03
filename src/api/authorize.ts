import { getIsTabValue, openWindow } from '../helper';
import { StoredOptions, AuthorizeOptions } from '../typings';
import authorizeUrl from './authorize-url';

export default function authorize(storedOptions: StoredOptions, options: AuthorizeOptions = {}): void {
  if (!window) {
    throw new Error('[mt-link-sdk] `authorize` only works in the browser.');
  }

  const { isNewTab, ...restOptions } = options;

  openWindow(authorizeUrl(storedOptions, restOptions), getIsTabValue(isNewTab));
}
