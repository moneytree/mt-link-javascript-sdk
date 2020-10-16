import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, TokenInfo } from '../typings';

export default async function tokenInfo(
  storedOptions: StoredOptions,
  token: string
): Promise<TokenInfo> {
  const { mode, clientId } = storedOptions;

  if (!token) {
    throw new Error('[mt-link-sdk] Missing parameter `token` in `tokenInfo`.');
  }

  try {
    const response = await fetch(`${MY_ACCOUNT_DOMAINS[mode]}/oauth/token/info.json`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-api-key': clientId as string,
      },
    });

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
