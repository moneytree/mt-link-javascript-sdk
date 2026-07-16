import { generateConfigs, mergeConfigs, objectToQueryString } from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, LogoutUrlOptions } from '../typings';

export default async function logoutUrl(storedOptions: StoredOptions, options: LogoutUrlOptions = {}): Promise<string> {
  const { clientId, mode, cobrandClientId, locale, samlSubjectId } = storedOptions;

  const configs = await generateConfigs(mergeConfigs(storedOptions, options));
  const queryString = objectToQueryString({
    client_id: clientId,
    cobrand_client_id: cobrandClientId,
    locale,
    saml_subject_id: samlSubjectId,
    configs
  });

  return `${MY_ACCOUNT_DOMAINS[mode]}/guests/logout?${queryString}`;
}
