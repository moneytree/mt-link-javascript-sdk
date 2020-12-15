import { stringify } from 'qs';

import {
  constructScopes,
  generateConfigs,
  mergeConfigs,
  getIsTabValue,
  generateCodeChallenge,
  openWindow,
} from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, OnboardOptions } from '../typings';
import storage from '../storage';

export default function onboard(storedOptions: StoredOptions, options: OnboardOptions = {}): void {
  if (!window) {
    throw new Error('[mt-link-sdk] `onboard` only works in the browser.');
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
    throw new Error('[mt-link-sdk] Make sure to call `init` before calling `onboard`.');
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

  const configs = mergeConfigs(storedOptions, rest, [
    'authAction',
    'showAuthToggle',
    'showRememberMe',
    'forceLogout',
  ]);

  if (!redirectUri) {
    throw new Error(
      '[mt-link-sdk] Missing option `redirectUri` in `onboard`, make sure to pass one via `onboard` options or `init` options.'
    );
  }

  const { email } = configs;

  if (!email) {
    throw new Error(
      '[mt-link-sdk] Missing option `email` in `onboard`, make sure to pass one via `onboard` options or `init` options.'
    );
  }

  if (!country) {
    throw new Error(
      '[mt-link-sdk] Missing option `country` in `onboard`, make sure to pass one via `onboard` options or `init` options.'
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
    configs: generateConfigs(configs),
  });

  openWindow(`${MY_ACCOUNT_DOMAINS[mode]}/onboard?${queryString}`, getIsTabValue(isNewTab));
}
