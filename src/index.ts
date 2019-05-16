import * as qs from 'qs';

import * as packageJSON from '../package.json';

import { DOMAIN, MY_ACCOUNT, VAULT } from './endpoints';

interface IConfig {
  clientId: string;
  scope: string[];
  isTestEnvironment?: boolean;
  redirectUri?: string;
  continueTo?: string;
  responseType?: 'code' | 'token';
  locale?: string;
  state?: string;
}

interface IParams {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope: string;
  continue?: string;
  locale?: string;
  state?: string;
}

interface IDomains {
  vault: string;
  myaccount: string;
}

interface IVaultOptions {
  backTo?: string;
  newTab?: boolean;
}

interface IMyAccountOptions {
  backTo?: string;
  newTab?: boolean;
  email?: string;
  authPage?: string;
  showAuthToggle?: boolean;
}

function removeOAuth2Params(params: IParams) {
  const validParams = { ...params };
  delete validParams.scope;
  delete validParams.redirect_uri;
  delete validParams.response_type;
  delete validParams.state;

  return validParams;
}

function encodeConfigWithParams(params: IParams, configs: { [k: string]: string | boolean | undefined }) {
  const endcodedConfigs = qs.stringify(configs, { delimiter: ';', encode: false });
  return qs.stringify({ ...params, configs: endcodedConfigs });
}

class LinkSDK {
  private domains: IDomains;
  private params: IParams;

  public init(config: IConfig): void {
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
  public authorize(options: IMyAccountOptions = {}): void {
    const { newTab = false, email, authPage, backTo, showAuthToggle } = options;

    const params = encodeConfigWithParams(this.params, {
      email,
      sdk_platform: 'js',
      sdk_version: packageJSON.version,
      auth_action: authPage,
      back_to: backTo,
      show_auth_toggle: showAuthToggle
    });

    window.open(`https://${this.domains.myaccount}/${MY_ACCOUNT.PATHS.OAUTH}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Vault page
  public openVault(options: IVaultOptions = {}): void {
    const { newTab = false, backTo = location.href } = options;
    const validParams = removeOAuth2Params(this.params);
    const params = encodeConfigWithParams(validParams, {
      sdk_platform: 'js',
      sdk_version: packageJSON.version,
      back_to: backTo
    });

    window.open(`https://${this.domains.vault}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Guest settings page
  public openSettings(options: IMyAccountOptions = {}): void {
    const { newTab = false, backTo = location.href } = options;

    const validParams = removeOAuth2Params(this.params);
    const params = encodeConfigWithParams(validParams, {
      sdk_platform: 'js',
      sdk_version: packageJSON.version,
      back_to: backTo
    });

    window.open(
      `https://${this.domains.myaccount}/${MY_ACCOUNT.PATHS.SETTINGS}?${params}`,
      newTab ? '_blank' : '_self'
    );
  }
}

export default new LinkSDK();
