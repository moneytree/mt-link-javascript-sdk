import { stringify } from 'qs';

import { generateConfigs, mergeConfigs } from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, LogoutUrlOptions } from '../typings';

export default function logoutUrl(storedOptions: StoredOptions, options: LogoutUrlOptions = {}): string {
  const { clientId, mode, cobrandClientId, locale, samlSubjectId } = storedOptions;

  const queryString = stringify({
    client_id: clientId,
    cobrand_client_id: cobrandClientId,
    locale,
    saml_subject_id: samlSubjectId,
    configs: generateConfigs(mergeConfigs(storedOptions, options))
  });

  return `${MY_ACCOUNT_DOMAINS[mode]}/guests/logout?${queryString}`;
}
