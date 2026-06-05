import { stringify } from 'qs';

import { generateConfigs, mergeConfigs } from '../helper';
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
  VaultOpenServiceUrlViewCustomerSupport
} from '../typings';

interface QueryData {
  client_id?: string;
  cobrand_client_id?: string;
  locale?: string;
  configs: string;
  saml_subject_id?: string;
  state?: string;
}

export default function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'link-kit',
  options?: LinkKitOpenServiceUrlOptions
): string;
export default function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'myaccount',
  options?: MyAccountOpenServiceUrlOptions
): string;
export default function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlOptions
): string;
export default function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewServiceList
): string;
export default function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewServiceConnection
): string;
export default function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewConnectionSetting
): string;
export default function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewConnectionUpdate
): string;
export default function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewConnectionDelete
): string;
export default function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'vault',
  options?: VaultOpenServiceUrlViewCustomerSupport
): string;
export default function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'myaccount' | 'vault' | 'link-kit',
  options: OpenServiceUrlOptions = {}
): string {
  const { clientId, mode, cobrandClientId, locale, samlSubjectId } = storedOptions;

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
      configs: generateConfigs(mergeConfigs(storedOptions, options)),
      state: vaultShowBackBarOn ? toVaultStateParam(vaultShowBackBarOn) : undefined
    };

    if (!needStringify) {
      return query;
    }

    return stringify(query);
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

          return `${VAULT_DOMAINS[mode]}/services?${stringify({
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
