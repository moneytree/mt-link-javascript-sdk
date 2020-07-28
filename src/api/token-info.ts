import qs from 'qs';

import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, TokenInfoOptions, TokenInfo } from '../typings';

export default async function tokenInfo(
  storedOptions: StoredOptions,
  token: string,
  options: TokenInfoOptions = {}
): Promise<TokenInfo> {
  const { clientId, redirectUri: defaultRedirectUri, mode } = storedOptions;
  const { redirectUri = defaultRedirectUri } = options;

  if (!token) {
    throw new Error('[mt-link-sdk] Missing parameter `token` in `tokenInfo`.');
  }

  if (!redirectUri) {
    throw new Error(
      '[mt-link-sdk] Missing option `redirectUri` in `tokenInfo`, make sure to pass one via `tokenInfo` options or `init` options.'
    );
  }

  const queryParams = qs.stringify({
    client_id: clientId, // TODO: test if we need this
    redirect_uri: redirectUri,
    response_type: 'token',
  });

  try {
    const response = await fetch(
      `${MY_ACCOUNT_DOMAINS[mode]}/oauth/token/info.json?${queryParams}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error_description);
    }

    return {
      guestUid: result.uid,
      resourceServer: result.resource_server,
      country: result.country,
      currency: result.currency,
      language: result.locale,
      clientId: result.aud.uid,
      clientName: result.aud.name,
      expTimestamp: result.exp,
      scopes: result.scopes,
      isMtClient: result.is_mt_client,
    };
  } catch (error) {
    throw new Error(`[mt-link-sdk] \`tokenInfo\` execution failed. ${error}`);
  }
}
