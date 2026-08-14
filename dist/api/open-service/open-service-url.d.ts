import { StoredOptions, LinkKitOpenServiceUrlOptions, MyAccountOpenServiceUrlOptions, VaultOpenServiceUrlOptions, VaultOpenServiceUrlViewServiceList, VaultOpenServiceUrlViewServiceConnection, VaultOpenServiceUrlViewConnectionSetting, VaultOpenServiceUrlViewConnectionUpdate, VaultOpenServiceUrlViewConnectionDelete, VaultOpenServiceUrlViewCustomerSupport, VaultOpenServiceUrlViewOnboarding } from '../../typings';
export interface QueryData {
    client_id?: string;
    cobrand_client_id?: string;
    locale?: string;
    configs: string;
    saml_subject_id?: string;
    state?: string;
}
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'link-kit', options?: LinkKitOpenServiceUrlOptions): Promise<string>;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'myaccount', options?: MyAccountOpenServiceUrlOptions): Promise<string>;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceUrlOptions): Promise<string>;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceUrlViewServiceList): Promise<string>;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceUrlViewServiceConnection): Promise<string>;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceUrlViewConnectionSetting): Promise<string>;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceUrlViewConnectionUpdate): Promise<string>;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceUrlViewConnectionDelete): Promise<string>;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceUrlViewCustomerSupport): Promise<string>;
export default function openServiceUrl(storedOptions: StoredOptions, serviceId: 'vault', options?: VaultOpenServiceUrlViewOnboarding): Promise<string>;
