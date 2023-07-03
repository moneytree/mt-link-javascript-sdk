import { getIsTabValue, openWindow } from '../helper';
import { StoredOptions, ServiceId, OpenServicesConfigsOptions } from '../typings';
import openServiceUrl from './open-service-url';

export default function openService(
  storedOptions: StoredOptions,
  serviceId: ServiceId,
  options: OpenServicesConfigsOptions = {}
): void {
  if (!window) {
    throw new Error('[mt-link-sdk] `openService` only works in the browser.');
  }

  const { isNewTab, ...restOptions } = options;

  openWindow(openServiceUrl(storedOptions, serviceId, restOptions), getIsTabValue(isNewTab));
}
