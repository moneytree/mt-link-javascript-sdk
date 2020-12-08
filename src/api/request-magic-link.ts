import { stringify } from 'qs';

import { generateConfigs, mergeConfigs, generateSdkHeaderInfo } from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, RequestMagicLinkOptions } from '../typings';

export default async function requestMagicLink(
  storedOptions: StoredOptions,
  options: RequestMagicLinkOptions = {}
): Promise<void> {
  const { clientId, mode, email: defaultEmail, cobrandClientId, locale } = storedOptions;
  const { email = defaultEmail, magicLinkTo, ...rest } = options;
  const configs = mergeConfigs(storedOptions, rest, ['email']);

  if (!email) {
    throw new Error(
      '[mt-link-sdk] Missing option `email` in `requestMagicLink`, make sure to pass one via `requestMagicLink` options or `init` options.'
    );
  }

  const queryString = stringify({
    client_id: clientId,
    cobrand_client_id: cobrandClientId,
    locale,
    configs: generateConfigs(configs),
  });

  const url = `${MY_ACCOUNT_DOMAINS[mode]}/magic-link.json?${queryString}`;

  let magicLinkToValue = magicLinkTo || '/settings';

  if (magicLinkToValue[0] !== '/') {
    magicLinkToValue = `/${magicLinkToValue}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...generateSdkHeaderInfo(),
      },
      body: JSON.stringify({
        email,
        magic_link_to: magicLinkToValue,
      }),
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.statusText);
    }
  } catch (error) {
    throw new Error(`[mt-link-sdk] \`requestMagicLink\` execution failed. ${error}`);
  }
}
