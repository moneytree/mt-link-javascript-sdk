import {
  constructScopes,
  generateConfigs,
  mergeConfigs,
  generateCodeChallenge,
  objectToQueryString
} from '../../helpers';
import { MY_ACCOUNT_DOMAINS } from '../../helpers/serverPaths';
import { StoredOptions, AuthorizeUrlOptions } from '../../typings';
import storage from '../../helpers/storage';

export default async function authorize(
  storedOptions: StoredOptions,
  options: AuthorizeUrlOptions = {}
): Promise<string> {
  const {
    mode,
    clientId,
    cobrandClientId,
    locale,
    scopes: defaultScopes,
    redirectUri: defaultRedirectUri,
    samlSubjectId
  } = storedOptions;

  if (!clientId) {
    throw new Error('[mt-link-sdk] Make sure to call `init` before calling `authorizeUrl/authorize`.');
  }

  const {
    scopes = defaultScopes,
    redirectUri = defaultRedirectUri,
    codeChallenge,
    state,
    affiliateCode,
    ...rest
  } = options;

  if (!redirectUri) {
    throw new Error(
      '[mt-link-sdk] Missing option `redirectUri` in `authorizeUrl/authorize`, make sure to pass one via `authorizeUrl/authorize` options or `init` options.'
    );
  }

  storage.del('cv');

  const cc = codeChallenge || (await generateCodeChallenge());

  const configs = await generateConfigs(mergeConfigs(storedOptions, rest));
  const queryString = objectToQueryString({
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
    saml_subject_id: samlSubjectId,
    configs,
    ...(affiliateCode ? { affiliate_code: affiliateCode } : {})
  });

  return `${MY_ACCOUNT_DOMAINS[mode]}/oauth/authorize?${queryString}`;
}
