import { stringify } from 'qs';

import { generateConfigs, mergeConfigs, generateSdkHeaderInfo } from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, RequestLoginLinkOptions } from '../typings';

export default async function requestLoginLink(
  storedOptions: StoredOptions,
  options: RequestLoginLinkOptions = {}
): Promise<void> {
  const { clientId, mode, email: defaultEmail, cobrandClientId, locale } = storedOptions;
  const { email = defaultEmail, loginLinkTo, ...rest } = options;
  const configs = mergeConfigs(storedOptions, rest, ['email']);

  if (!email) {
    throw new Error(
      '[mt-link-sdk] Missing option `email` in `requestLoginLink`, make sure to pass one via `requestLoginLink` options or `init` options.'
    );
  }

  const queryString = stringify({
    client_id: clientId,
    cobrand_client_id: cobrandClientId,
    locale,
    configs: generateConfigs(configs)
  });

  const url = `${MY_ACCOUNT_DOMAINS[mode]}/magic-link.json?${queryString}`;

  let loginLinkToValue = loginLinkTo || '/settings';

  if (loginLinkToValue[0] !== '/') {
    loginLinkToValue = `/${loginLinkToValue}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...generateSdkHeaderInfo()
      },
      body: JSON.stringify({
        email,
        magic_link_to: loginLinkToValue
      })
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.statusText);
    }
  } catch (error) {
    throw new Error(`[mt-link-sdk] \`requestLoginLink\` execution failed. ${error}`);
  }
}
