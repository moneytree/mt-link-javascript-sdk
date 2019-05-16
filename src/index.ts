import * as qs from 'qs';

import { DOMAIN, MY_ACCOUNT, VAULT } from './endpoints';

interface IConfig {
  clientId: string;
  scope?: string[];
  isTestEnvironment?: boolean;
  redirectUri?: string;
  continueTo?: string;
  responseType?: 'code' | 'token';
  locale?: string;
  state?: string;
}

export interface IParams {
  client_id: string;
  locale?: string;
  continueTo?: string;
}

export interface IOauthParams {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope?: string;
  state?: string;
}

export interface IDomains {
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

function encodeConfigWithParams(params: any, configs: { [k: string]: string | boolean | undefined }) {
  const endcodedConfigs = qs.stringify(configs, { delimiter: ';', encode: false });
  return qs.stringify({ ...params, configs: endcodedConfigs });
}

class LinkSDK {
  private domains: IDomains;
  private params: IParams;
  private oauthParams: IOauthParams;

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
      state,
      continueTo
    } = config;

    this.params = {
      client_id: clientId,
      locale,
      continueTo
    };

    this.oauthParams = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
      scope: scope.length ? scope.join(' ') : undefined,
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

    const params = encodeConfigWithParams(
      { ...this.oauthParams, ...this.params },
      {
        email,
        sdk_platform: 'js',
        sdk_version: VERSION,
        auth_action: authPage,
        back_to: backTo,
        show_auth_toggle: showAuthToggle
      }
    );

    window.open(`https://${this.domains.myaccount}/${MY_ACCOUNT.PATHS.OAUTH}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Vault page
  public openVault(options: IVaultOptions = {}): void {
    const { newTab = false, backTo = location.href } = options;
    const params = encodeConfigWithParams(this.params, {
      sdk_platform: 'js',
      sdk_version: VERSION,
      back_to: backTo
    });

    window.open(`https://${this.domains.vault}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Guest settings page
  public openSettings(options: IMyAccountOptions = {}): void {
    const { newTab = false, backTo = location.href } = options;

    const params = encodeConfigWithParams(this.params, {
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
