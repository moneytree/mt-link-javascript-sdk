import { generateConfigs, mergeConfigs, objectToQueryString } from '../helper';
import { MY_ACCOUNT_DOMAINS, VAULT_DOMAINS, LINK_KIT_DOMAINS } from '../server-paths';
import {
  StoredOptions,
  VaultViewConnectionSetting,
  VaultViewServiceConnection,
  VaultViewServiceList,
  OpenServiceUrlOptions,
  VaultServiceTypes,
  MyAccountServiceTypes,
  LinkKitOpenServiceUrlOptions,
  MyAccountOpenServiceUrlOptions,
  VaultOpenServiceUrlOptions,
  VaultSpecificOptions,
  VaultOpenServiceUrlViewServiceList,
  VaultOpenServiceUrlViewServiceConnection,
  VaultOpenServiceUrlViewConnectionSetting,
  VaultOpenServiceUrlViewConnectionUpdate,
  VaultOpenServiceUrlViewConnectionDelete,
  VaultOpenServiceUrlViewCustomerSupport,
  VaultOpenServiceUrlViewOnboarding
} from '../typings';

export interface QueryData {
  client_id?: string;
  cobrand_client_id?: string;
  locale?: string;
  configs: string;
  saml_subject_id?: string;
  state?: string;
}

export default async function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'link-kit',
  options?: LinkKitOpenServiceUrlOptions
): Promise<string>;
export default async function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'myaccount',
  options?: MyAccountOpenServiceUrlOptions
): Promise<string>;
export default async function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlOptions
): Promise<string>;
export default async function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewServiceList
): Promise<string>;
export default async function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewServiceConnection
): Promise<string>;
export default async function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewConnectionSetting
): Promise<string>;
export default async function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewConnectionUpdate
): Promise<string>;
export default async function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewConnectionDelete
): Promise<string>;
export default async function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewCustomerSupport
): Promise<string>;
export default async function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewOnboarding
): Promise<string>;
export default async function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'myaccount' | 'vault' | 'link-kit',
  options: OpenServiceUrlOptions = {}
): Promise<string> {
  const { clientId, mode, cobrandClientId, locale, samlSubjectId } = storedOptions;
  const configs = await generateConfigs(mergeConfigs(storedOptions, options));

  const toVaultStateParam = (value: NonNullable<VaultSpecificOptions['showBackBarOn']>): string => {
    switch (value.view) {
      case 'services-list':
        return 'url=/services';
      case 'connection-setting':
        return `url=/connection/${value.credentialId}`;
    }
  };

  const getQueryValue = (needStringify = true): string | QueryData => {
    const vaultShowBackBarOn = serviceId === 'vault' && 'showBackBarOn' in options && options.showBackBarOn;

    const query: QueryData = {
      client_id: clientId,
      cobrand_client_id: cobrandClientId,
      locale,
      saml_subject_id: samlSubjectId,
      state: vaultShowBackBarOn ? toVaultStateParam(vaultShowBackBarOn) : undefined,
      configs
    };

    if (!needStringify) {
      return query;
    }

    return objectToQueryString(query);
  };

  const { view: vaultView } = options as VaultServiceTypes;

  switch (serviceId) {
    case 'vault':
      if (!vaultView) {
        return `${VAULT_DOMAINS[mode]}?${getQueryValue()}`;
      }

      switch (vaultView) {
        case 'services-list':
          // eslint-disable-next-line no-case-declarations
          const { group, type, search } = options as VaultViewServiceList;

          return `${VAULT_DOMAINS[mode]}/services?${objectToQueryString({
            ...(getQueryValue(false) as QueryData),
            group,
            type,
            search
          })}`;

        case 'service-connection': {
          const { entityKey } = options as VaultViewServiceConnection;

          return `${VAULT_DOMAINS[mode]}/service/${entityKey}?${getQueryValue()}`;
        }

        case 'connection-setting': {
          const { credentialId } = options as VaultViewConnectionSetting;

          return `${VAULT_DOMAINS[mode]}/connection/${credentialId}?${getQueryValue()}`;
        }

        case 'connection-update': {
          const { credentialId } = options as VaultViewConnectionSetting;

          return `${VAULT_DOMAINS[mode]}/connection/${credentialId}/update?${getQueryValue()}`;
        }

        case 'connection-delete': {
          const { credentialId } = options as VaultViewConnectionSetting;

          return `${VAULT_DOMAINS[mode]}/connection/${credentialId}/delete?${getQueryValue()}`;
        }

        case 'onboarding': {
          return `${VAULT_DOMAINS[mode]}/onboarding?${getQueryValue()}`;
        }

        case 'customer-support':
        default:
          return `${VAULT_DOMAINS[mode]}/customer-support?${getQueryValue()}`;
      }

    case 'myaccount':
      return `${MY_ACCOUNT_DOMAINS[mode]}/${(options as MyAccountServiceTypes).view || ''}?${getQueryValue()}`;

    case 'link-kit':
      return `${LINK_KIT_DOMAINS[mode]}?${getQueryValue()}`;

    default:
      throw new Error(`[mt-link-sdk] Invalid \`serviceId\` in \`openServiceUrl\`, got: ${serviceId}`);
  }
}
