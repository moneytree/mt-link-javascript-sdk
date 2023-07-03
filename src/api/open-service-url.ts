import { stringify } from 'qs';

import { generateConfigs, mergeConfigs } from '../helper';
import { MY_ACCOUNT_DOMAINS, VAULT_DOMAINS, LINK_KIT_DOMAINS } from '../server-paths';
import {
  StoredOptions,
  ServiceId,
  OpenServicesUrlConfigsOptions,
  ConnectionSettingType,
  ServiceConnectionType,
  ServicesListType
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
  serviceId: ServiceId,
  options: OpenServicesUrlConfigsOptions = {}
): string {
  const { clientId, mode, cobrandClientId, locale, samlSubjectId } = storedOptions;
  const { view = '', ...rest } = options;

  const getQueryValue = (needStringify = true): string | QueryData => {
    const query: QueryData = {
      client_id: clientId,
      cobrand_client_id: cobrandClientId,
      locale,
      saml_subject_id: samlSubjectId,
      configs: generateConfigs(mergeConfigs(storedOptions, rest))
    };

    if (!needStringify) {
      return query;
    }

    return stringify(query);
  };

  switch (serviceId) {
    case 'vault':
      if (!view) {
        return `${VAULT_DOMAINS[mode]}?${getQueryValue()}`;
      }

      switch (view) {
        case 'services-list':
          // eslint-disable-next-line no-case-declarations
          const { group, type, search } = options as ServicesListType;

          return `${VAULT_DOMAINS[mode]}/services?${stringify({
            ...(getQueryValue(false) as QueryData),
            group,
            type,
            search
          })}`;

        case 'service-connection':
          // eslint-disable-next-line no-case-declarations
          const { entityKey } = options as ServiceConnectionType;

          return `${VAULT_DOMAINS[mode]}/service/${entityKey}?${getQueryValue()}`;

        case 'connection-setting':
          // eslint-disable-next-line no-case-declarations
          const { credentialId } = options as ConnectionSettingType;

          return `${VAULT_DOMAINS[mode]}/connection/${credentialId}?${getQueryValue()}`;

        case 'customer-support':
        default:
          return `${VAULT_DOMAINS[mode]}/customer-support?${getQueryValue()}`;
      }

    case 'myaccount':
      return `${MY_ACCOUNT_DOMAINS[mode]}/${view}?${getQueryValue()}`;

    case 'link-kit':
      return `${LINK_KIT_DOMAINS[mode]}?${getQueryValue()}`;

    default:
      throw new Error(`[mt-link-sdk] Invalid \`serviceId\` in \`openServiceUrl/openService\`, got: ${serviceId}`);
  }
}
