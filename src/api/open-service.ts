import { getIsTabValue, openWindow } from '../helper';
import {
  StoredOptions,
  ServiceId,
  OpenServiceOptions,
  LinkKitOpenServiceOptions,
  MyAccountOpenServiceOptions,
  VaultOpenServiceOptions,
  VaultOpenServiceViewServiceList,
  VaultOpenServiceViewServiceConnection,
  VaultOpenServiceViewConnectionSetting,
  VaultOpenServiceViewConnectionUpdate,
  VaultOpenServiceViewConnectionDelete,
  VaultOpenServiceViewCustomerSupport,
} from '../typings';
import openServiceUrl from './open-service-url';

export default async function openService(
  storedOptions: StoredOptions,
  serviceId: 'link-kit',
  options?: LinkKitOpenServiceOptions
): Promise<void>;
export default async function openService(
  storedOptions: StoredOptions,
  serviceId: 'myaccount',
  options?: MyAccountOpenServiceOptions
): Promise<void>;
export default async function openService(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceOptions): Promise<void>;
export default async function openService(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceViewServiceList
): Promise<void>;
export default async function openService(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceViewServiceConnection
): Promise<void>;
export default async function openService(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceViewConnectionSetting
): Promise<void>;
export default async function openService(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceViewConnectionUpdate
): Promise<void>;
export default async function openService(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceViewConnectionDelete
): Promise<void>;
export default async function openService(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceViewCustomerSupport
): Promise<void>;
export default async function openService(
  storedOptions: StoredOptions,
  serviceId: ServiceId,
  options: OpenServiceOptions = {}
): Promise<void> {
  if (!window) {
    throw new Error('[mt-link-sdk] `openService` only works in the browser.');
  }

  const { isNewTab, ...restOptions } = options;

  switch (serviceId) {
    case 'myaccount':
      openWindow(await openServiceUrl(storedOptions, 'myaccount', restOptions), getIsTabValue(isNewTab));
      break;
    case 'vault':
      openWindow(await openServiceUrl(storedOptions, 'vault', restOptions), getIsTabValue(isNewTab));
      break;
    case 'link-kit':
      openWindow(await openServiceUrl(storedOptions, 'link-kit', restOptions), getIsTabValue(isNewTab));
      break;
    default:
      throw new Error(`[mt-link-sdk] Invalid \`serviceId\` in \`openService\`, got: ${serviceId}`);
  }
}
