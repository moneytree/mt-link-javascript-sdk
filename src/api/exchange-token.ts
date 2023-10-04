import qs from 'qs';

import { generateSdkHeaderInfo } from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, ExchangeTokenOptions, Token } from '../typings';
import storage from '../storage';

function getCode(): string | undefined {
  // not available in node environment
  if (!window) {
    return;
  }

  const { code } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true
  });

  return (Array.isArray(code) ? code[code.length - 1] : code) as string | undefined;
}

export default async function exchangeToken(
  storedOptions: StoredOptions,
  options: ExchangeTokenOptions = {}
): Promise<Token> {
  const { clientId, redirectUri: defaultRedirectUri, mode } = storedOptions;

  if (!clientId) {
    throw new Error('[mt-link-sdk] Make sure to call `init` before calling `exchangeToken`.');
  }

  const { redirectUri = defaultRedirectUri, code = getCode(), codeVerifier } = options;

  if (!code) {
    throw new Error(
      '[mt-link-sdk] Missing option `code` in `exchangeToken`, or failed to get `code` from query/hash value from the URL.'
    );
  }

  if (!redirectUri) {
    throw new Error(
      '[mt-link-sdk] Missing option `redirectUri` in `exchangeToken`, make sure to pass one via `exchangeToken` options or `init` options.'
    );
  }

  try {
    const response = await fetch(`${MY_ACCOUNT_DOMAINS[mode]}/oauth/token.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...generateSdkHeaderInfo()
      },
      body: JSON.stringify({
        code,
        client_id: clientId,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier || (code ? storage.get('cv') : undefined)
      })
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error_description);
    }

    return result as Token;
  } catch (error) {
    throw new Error(`[mt-link-sdk] \`exchangeToken\` execution failed. ${error}`);
  }
}
