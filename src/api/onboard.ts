import { getIsTabValue, openWindow } from '../helper';
import { StoredOptions, OnboardOptions } from '../typings';
import onboardUrl from './onboard-url';

export default async function onboard(storedOptions: StoredOptions, options: OnboardOptions = {}): Promise<void> {
  if (!window) {
    throw new Error('[mt-link-sdk] `onboard` only works in the browser.');
  }

  const { isNewTab, ...restOptions } = options;

  openWindow(await onboardUrl(storedOptions, restOptions), getIsTabValue(isNewTab));
}
