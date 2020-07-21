import { stringify } from 'qs';

import { generateConfigs, mergeConfigs, getIsTabValue } from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, LogoutOptions } from '../typings';

export default function logout(storedOptions: StoredOptions, options: LogoutOptions = {}): void {
  if (!window) {
    throw new Error(`[mt-link-sdk] \`logout\` only works in the browser.`);
  }

  const { clientId, mode, cobrandClientId, locale } = storedOptions;
  const { isNewTab, ...rest } = options;

  const queryString = stringify({
    client_id: clientId,
    cobrand_client_id: cobrandClientId,
    locale,
    configs: generateConfigs(mergeConfigs(storedOptions, rest)),
  });

  window.open(`${MY_ACCOUNT_DOMAINS[mode]}/guests/logout?${queryString}`, getIsTabValue(isNewTab));
}
