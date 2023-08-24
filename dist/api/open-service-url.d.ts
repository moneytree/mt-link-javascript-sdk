import { StoredOptions, LinkKitOpenServiceUrlOptions, MyAccountOpenServiceUrlOptions, ConfigsOptionsWithoutIsNewTab, VaultOpenServiceUrlViewServiceList, VaultOpenServiceUrlViewServiceConnection, VaultOpenServiceUrlViewConnectionSetting, VaultOpenServiceUrlViewCustomerSupport } from '../typings';
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'link-kit', options?: LinkKitOpenServiceUrlOptions): string;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'myaccount', options?: MyAccountOpenServiceUrlOptions): string;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: ConfigsOptionsWithoutIsNewTab): string;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceUrlViewServiceList): string;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceUrlViewServiceConnection): string;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceUrlViewConnectionSetting): string;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceUrlViewCustomerSupport): string;
