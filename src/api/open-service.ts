import { getIsTabValue, openWindow } from '../helper';
import {
  StoredOptions,
  ServiceId,
  OpenServiceOptions,
  LinkKitOpenServiceOptions,
  MyAccountOpenServiceOptions,
  VaultOpenServiceViewServiceList,
  VaultOpenServiceViewServiceConnection,
  VaultOpenServiceViewConnectionSetting,
  VaultOpenServiceViewCustomerSupport,
  ConfigsOptions
} from '../typings';
import openServiceUrl from './open-service-url';

export default function openService(
  storedOptions: StoredOptions,
  serviceId: 'link-kit',
  options?: LinkKitOpenServiceOptions
): void;
export default function openService(
  storedOptions: StoredOptions,
  serviceId: 'myaccount',
  options?: MyAccountOpenServiceOptions
): void;
export default function openService(storedOptions: StoredOptions, serviceId: 'vault', options?: ConfigsOptions): void;
export default function openService(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceViewServiceList
): void;
export default function openService(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceViewServiceConnection
): void;
export default function openService(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceViewConnectionSetting
): void;
export default function openService(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceViewCustomerSupport
): void;
export default function openService(
  storedOptions: StoredOptions,
  serviceId: ServiceId,
  options: OpenServiceOptions = {}
): void {
  if (!window) {
    throw new Error('[mt-link-sdk] `openService` only works in the browser.');
  }

  const { isNewTab, ...restOptions } = options;

  switch (serviceId) {
    case 'myaccount':
      openWindow(openServiceUrl(storedOptions, 'myaccount', restOptions), getIsTabValue(isNewTab));
      break;
    case 'vault':
      openWindow(openServiceUrl(storedOptions, 'vault', restOptions), getIsTabValue(isNewTab));
      break;
    case 'link-kit':
      openWindow(openServiceUrl(storedOptions, 'link-kit', restOptions), getIsTabValue(isNewTab));
      break;
    default:
      throw new Error(`[mt-link-sdk] Invalid \`serviceId\` in \`openService\`, got: ${serviceId}`);
  }
}
