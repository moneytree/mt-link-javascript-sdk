import { getIsTabValue, openWindow } from '../helper';
import { StoredOptions, OnboardOptions } from '../typings';
import onboardUrl from './onboard-url';

export default function onboard(storedOptions: StoredOptions, options: OnboardOptions = {}): void {
  if (!window) {
    throw new Error('[mt-link-sdk] `onboard` only works in the browser.');
  }

  const { isNewTab, ...restOptions } = options;

  openWindow(onboardUrl(storedOptions, restOptions), getIsTabValue(isNewTab));
}
