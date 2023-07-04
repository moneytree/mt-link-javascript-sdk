import { stringify } from 'qs';

import { constructScopes, generateConfigs, mergeConfigs, generateCodeChallenge } from '../helper';
import { MY_ACCOUNT_DOMAINS } from '../server-paths';
import { StoredOptions, OnboardUrlOptions } from '../typings';
import storage from '../storage';

export default function onboardUrl(storedOptions: StoredOptions, options: OnboardUrlOptions = {}): string {
  const {
    mode,
    clientId,
    cobrandClientId,
    locale,
    scopes: defaultScopes,
    redirectUri: defaultRedirectUri
  } = storedOptions;

  if (!clientId) {
    throw new Error('[mt-link-sdk] Make sure to call `init` before calling `onboardUrl/onboard`.');
  }

  const {
    scopes = defaultScopes,
    redirectUri = defaultRedirectUri,
    pkce = false,
    codeChallenge,
    state,
    ...rest
  } = options;

  const configs = mergeConfigs(storedOptions, rest, ['authAction', 'showAuthToggle', 'showRememberMe', 'forceLogout']);

  if (!redirectUri) {
    throw new Error(
      '[mt-link-sdk] Missing option `redirectUri` in `onboardUrl/onboard`, make sure to pass one via `onboardUrl/onboard` options or `init` options.'
    );
  }

  const { email } = configs;

  if (!email) {
    throw new Error(
      '[mt-link-sdk] Missing option `email` in `onboardUrl/onboard`, make sure to pass one via `onboardUrl/onboard` options or `init` options.'
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
    country: 'JP',
    locale,
    configs: generateConfigs(configs)
  });

  return `${MY_ACCOUNT_DOMAINS[mode]}/onboard?${queryString}`;
}
