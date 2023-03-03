import { stringify } from 'qs';
import { generateConfigs, generateSdkHeaderInfo } from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, TokenInfo } from '../typings';

export default async function tokenInfo(storedOptions: StoredOptions, token: string): Promise<TokenInfo> {
  const { mode, clientId } = storedOptions;

  if (!token) {
    throw new Error('[mt-link-sdk] Missing parameter `token` in `tokenInfo`.');
  }

  const queryString = stringify({
    client_id: clientId,
    cobrand_client_id: storedOptions.cobrandClientId,
    configs: generateConfigs(storedOptions)
  });

  try {
    const response = await fetch(`${MY_ACCOUNT_DOMAINS[mode]}/oauth/token/info.json?${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'API-Version': '1604911588',
        ...generateSdkHeaderInfo()
      }
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error_description);
    }

    return result;
  } catch (error) {
    throw new Error(`[mt-link-sdk] \`tokenInfo\` execution failed. ${error}`);
  }
}
