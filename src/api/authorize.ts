import { stringify } from 'qs';

import {
  constructScopes,
  generateConfigs,
  mergeConfigs,
  getIsTabValue,
  generateCodeChallenge,
} from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, AuthorizeOptions } from '../typings';
import storage from '../storage';

export default function authorize(
  storedOptions: StoredOptions,
  options: AuthorizeOptions = {}
): void {
  if (!window) {
    throw new Error('[mt-link-sdk] `authorize` only works in the browser.');
  }

  const {
    mode,
    clientId,
    cobrandClientId,
    locale,
    scopes: defaultScopes,
    redirectUri: defaultRedirectUri,
    country: defaultCountry,
  } = storedOptions;

  if (!clientId) {
    throw new Error('[mt-link-sdk] Make sure to call `init` before calling `authorize`.');
  }

  const {
    scopes = defaultScopes,
    redirectUri = defaultRedirectUri,
    country = defaultCountry,
    pkce = false,
    codeChallenge,
    isNewTab,
    state,
    ...rest
  } = options;

  if (!redirectUri) {
    throw new Error(
      '[mt-link-sdk] Missing option `redirectUri` in `authorize`, make sure to pass one via `authorize` options or `init` options.'
    );
  }

  storage.del('cv');

  const cc = codeChallenge || (pkce && generateCodeChallenge());

  const queryString = stringify({
    client_id: clientId,
    cobrand_client_id: cobrandClientId,
    response_type: 'code',
    scope: constructScopes(scopes),
    redirect_uri: redirectUri,
    code_challenge: cc || undefined,
    code_challenge_method: cc ? 'S256' : undefined,
    state,
    country,
    locale,
    configs: generateConfigs(mergeConfigs(storedOptions, rest)),
  });

  window.open(
    `${MY_ACCOUNT_DOMAINS[mode]}/oauth/authorize?${queryString}`,
    getIsTabValue(isNewTab)
  );
}
