import { stringify } from 'qs';

import { generateConfigs, mergeConfigs, getIsTabValue, openWindow } from '../helper';
import { MY_ACCOUNT_DOMAINS, VAULT_DOMAINS, LINK_KIT_DOMAINS } from '../server-paths';
import {
  StoredOptions,
  ServiceId,
  OpenServicesConfigsOptions,
  ConnectionSettingType,
  ServiceConnectionType,
  ServicesListType,
} from '../typings';

interface QueryData {
  client_id?: string;
  cobrand_client_id?: string;
  locale?: string;
  configs: string;
}

export default function openService(
  storedOptions: StoredOptions,
  serviceId: ServiceId,
  options: OpenServicesConfigsOptions = {}
): void {
  if (!window) {
    throw new Error('[mt-link-sdk] `openService` only works in the browser.');
  }

  const { clientId, mode, cobrandClientId, locale } = storedOptions;
  const { isNewTab, view, ...rest } = options;

  const getQueryValue = (needStringify = true): string | QueryData => {
    const query: QueryData = {
      client_id: clientId,
      cobrand_client_id: cobrandClientId,
      locale,
      configs: generateConfigs(mergeConfigs(storedOptions, rest)),
    };

    if (!needStringify) {
      return query;
    }

    return stringify(query);
  };

  switch (serviceId) {
    case 'vault':
      if (!view) {
        openWindow(`${VAULT_DOMAINS[mode]}?${getQueryValue()}`, getIsTabValue(isNewTab));
        break;
      }

      switch (view) {
        case 'services-list':
          // eslint-disable-next-line no-case-declarations
          const { group, type, search } = options as ServicesListType;

          openWindow(
            `${VAULT_DOMAINS[mode]}/services?${stringify({
              ...(getQueryValue(false) as QueryData),
              group,
              type,
              search,
            })}`,
            getIsTabValue(isNewTab)
          );
          break;

        case 'service-connection':
          // eslint-disable-next-line no-case-declarations
          const { entityKey } = options as ServiceConnectionType;

          openWindow(
            `${VAULT_DOMAINS[mode]}/service/${entityKey}?${getQueryValue()}`,
            getIsTabValue(isNewTab)
          );
          break;

        case 'connection-setting':
          // eslint-disable-next-line no-case-declarations
          const { credentialId } = options as ConnectionSettingType;

          openWindow(
            `${VAULT_DOMAINS[mode]}/connection/${credentialId}?${getQueryValue()}`,
            getIsTabValue(isNewTab)
          );
          break;

        case 'customer-support':
        default:
          openWindow(
            `${VAULT_DOMAINS[mode]}/customer-support?${getQueryValue()}`,
            getIsTabValue(isNewTab)
          );
          break;
      }

      break;

    case 'myaccount-settings':
      openWindow(
        `${MY_ACCOUNT_DOMAINS[mode]}/settings?${getQueryValue()}`,
        getIsTabValue(isNewTab)
      );
      break;

    case 'link-kit':
      openWindow(`${LINK_KIT_DOMAINS[mode]}?${getQueryValue()}`, getIsTabValue(isNewTab));
      break;

    default:
      throw new Error(`[mt-link-sdk] Invalid \`serviceId\` in \`openService\`, got: ${serviceId}`);
  }
}
