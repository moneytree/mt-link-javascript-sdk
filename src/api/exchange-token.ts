import qs from 'qs';

import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, ExchangeTokenOptions } from '../typings';

function getCodeAndState(): { code?: string; state?: string } {
  // not available in node environment
  if (!window) {
    return {};
  }

  const { code, state } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true
  });

  return {
    code: (Array.isArray(code) ? code[code.length - 1] : code) as string,
    state: (Array.isArray(state) ? state[state.length - 1] : state) as string
  };
}

export default async function exchangeToken(
  storedOptions: StoredOptions,
  options: ExchangeTokenOptions = {}
): Promise<string> {
  const {
    clientId,
    redirectUri: defaultRedirectUri,
    state: defaultState,
    mode,
    codeVerifier: defaultCodeVerifier
  } = storedOptions;

  if (!clientId) {
    throw new Error('[mt-link-sdk] Make sure to call `init` before calling `exchangeToken`.');
  }

  const { code: extractedCode, state: extractedState } = getCodeAndState();

  const {
    redirectUri = defaultRedirectUri,
    state = extractedState,
    codeVerifier = defaultCodeVerifier,
    code = extractedCode
  } = options;

  if (!code) {
    throw new Error(
      '[mt-link-sdk] Missing option `code` in `exchangeToken`, or failed to get `code` from query/hash value from the URL.'
    );
  }

  if (state && defaultState !== state) {
    throw new Error(
      '[mt-link-sdk] `state` does not matched, make sure to pass in the correct state used during `authorize` or `onboard` call'
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        client_id: clientId,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier || undefined,
        code_challenge_method: codeVerifier ? 'S256' : undefined
      })
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error_description);
    }

    return result.access_token;
  } catch (error) {
    throw new Error(`[mt-link-sdk] \`exchangeToken\` execution failed. ${error}`);
  }
}
