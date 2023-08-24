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
  ConfigsOptionsWithoutIsNewTab,
  VaultOpenServiceUrlViewServiceList,
  VaultOpenServiceUrlViewServiceConnection,
  VaultOpenServiceUrlViewConnectionSetting,
  VaultOpenServiceUrlViewCustomerSupport
} from '../typings';

interface QueryData {
  client_id?: string;
  cobrand_client_id?: string;
  locale?: string;
  configs: string;
  saml_subject_id?: string;
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
  options?: ConfigsOptionsWithoutIsNewTab
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
  options?: VaultOpenServiceUrlViewCustomerSupport
): string;
export default function openServiceUrl(
  storedOptions: StoredOptions,
  serviceId: 'myaccount' | 'vault' | 'link-kit',
  options: OpenServiceUrlOptions = {}
): string {
  const { clientId, mode, cobrandClientId, locale, samlSubjectId } = storedOptions;

  const getQueryValue = (needStringify = true): string | QueryData => {
    const query: QueryData = {
      client_id: clientId,
      cobrand_client_id: cobrandClientId,
      locale,
      saml_subject_id: samlSubjectId,
      configs: generateConfigs(mergeConfigs(storedOptions, options))
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

        case 'service-connection':
          // eslint-disable-next-line no-case-declarations
          const { entityKey } = options as VaultViewServiceConnection;

          return `${VAULT_DOMAINS[mode]}/service/${entityKey}?${getQueryValue()}`;

        case 'connection-setting':
          // eslint-disable-next-line no-case-declarations
          const { credentialId } = options as VaultViewConnectionSetting;

          return `${VAULT_DOMAINS[mode]}/connection/${credentialId}?${getQueryValue()}`;

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
