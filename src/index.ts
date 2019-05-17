import * as qs from 'qs';

import { DOMAIN, MY_ACCOUNT, VAULT } from './endpoints';

interface Config {
  clientId: string;
  scope: string[];
  isTestEnvironment?: boolean;
  redirectUri?: string;
  continueTo?: string;
  responseType?: 'code' | 'token';
  locale?: string;
  state?: string;
}

interface Params {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope: string;
  continue?: string;
  locale?: string;
  state?: string;
}

interface Domains {
  vault: string;
  myaccount: string;
}

interface VaultOptions {
  backTo?: string;
  newTab?: boolean;
}

interface MyAccountOptions {
  backTo?: string;
  newTab?: boolean;
  email?: string;
  authPage?: string;
  showAuthToggle?: boolean;
}

function removeOAuth2Params(params: Params) {
  const validParams = { ...params };
  delete validParams.scope;
  delete validParams.redirect_uri;
  delete validParams.response_type;
  delete validParams.state;

  return validParams;
}

function encodeConfigWithParams(params: Params, configs: { [k: string]: string | boolean | undefined }) {
  const endcodedConfigs = qs.stringify(configs, { delimiter: ';', encode: false });
  return qs.stringify({ ...params, configs: endcodedConfigs });
}

class LinkSDK {
  private domains: Domains;
  private params: Params;

  init(config: Config): void {
    if (!config.clientId) {
      throw new Error('Need a clientId to initialise');
    }

    const {
      clientId,
      redirectUri = `${location.protocol}//${location.host}/callback`,
      responseType = 'token',
      scope = [],
      locale,
      state
    } = config;

    this.params = {
      continue: config.continueTo,
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
      scope: scope.join(' '),
      locale,
      state
    };

    const subdomain = config.isTestEnvironment ? 'TEST_SUBDOMAIN' : 'SUBDOMAIN';
    this.domains = {
      vault: `${VAULT[subdomain]}.${DOMAIN}`,
      myaccount: `${MY_ACCOUNT[subdomain]}.${DOMAIN}`
    };
  }

  // Open My Account to authorize application to use MtLink API
  authorize(options: MyAccountOptions = {}): void {
    const { newTab = false, email, authPage, backTo, showAuthToggle } = options;

    const params = encodeConfigWithParams(this.params, {
      email,
      sdk_platform: 'js',
      sdk_version: VERSION,
      auth_action: authPage,
      back_to: backTo,
      show_auth_toggle: showAuthToggle
    });

    window.open(`https://${this.domains.myaccount}/${MY_ACCOUNT.PATHS.OAUTH}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Vault page
  openVault(options: VaultOptions = {}): void {
    const { newTab = false, backTo = location.href } = options;
    const validParams = removeOAuth2Params(this.params);
    const params = encodeConfigWithParams(validParams, {
      sdk_platform: 'js',
      sdk_version: VERSION,
      back_to: backTo
    });

    window.open(`https://${this.domains.vault}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Guest settings page
  openSettings(options: MyAccountOptions = {}): void {
    const { newTab = false, backTo = location.href } = options;

    const validParams = removeOAuth2Params(this.params);
    const params = encodeConfigWithParams(validParams, {
      sdk_platform: 'js',
      sdk_version: VERSION,
      back_to: backTo
    });

    window.open(
      `https://${this.domains.myaccount}/${MY_ACCOUNT.PATHS.SETTINGS}?${params}`,
      newTab ? '_blank' : '_self'
    );
  }
}

export default new LinkSDK();
