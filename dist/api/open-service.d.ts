import { StoredOptions, LinkKitOpenServiceOptions, MyAccountOpenServiceOptions, VaultOpenServiceViewServiceList, VaultOpenServiceViewServiceConnection, VaultOpenServiceViewConnectionSetting, VaultOpenServiceViewCustomerSupport, ConfigsOptions } from '../typings';
export default function openService(storedOptions: StoredOptions, serviceId: 'link-kit', options?: LinkKitOpenServiceOptions): void;
export default function openService(storedOptions: StoredOptions, serviceId: 'myaccount', options?: MyAccountOpenServiceOptions): void;
export default function openService(storedOptions: StoredOptions, serviceId: 'vault', options?: ConfigsOptions): void;
export default function openService(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceViewServiceList): void;
export default function openService(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceViewServiceConnection): void;
export default function openService(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceViewConnectionSetting): void;
export default function openService(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceViewCustomerSupport): void;
