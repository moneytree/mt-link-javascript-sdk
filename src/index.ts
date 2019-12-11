import { stringify } from 'qs';

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
  continue?: string;
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

interface IVaultService extends IVaultOptions {
  key: string;
}

interface IMyAccountOptions {
  backTo?: string;
  newTab?: boolean;
  email?: string;
  authPage?: string;
  showAuthToggle?: boolean;
}

interface IUrlConfig {
  email?: string;
  auth_action?: string;
  show_auth_toggle?: boolean;
}

const commonUrlConfig = {
  sdk_platform: 'js',
  sdk_version: VERSION
};

type ICommonUrlConfig = typeof commonUrlConfig & { back_to?: string };

function encodeConfigWithParams<Params, Configs>(params: Params, configs: Configs) {
  const encodedConfigs = stringify(configs, { delimiter: ';', encode: false });
  return stringify({ ...params, configs: encodedConfigs }, { addQueryPrefix: true });
}

class LinkSDK {
  private domains: IDomains;
  private params: IParams;
  private oauthParams: IOauthParams;

  private isInitialized: boolean = false;

  public init({
    clientId,
    scope = [],
    isTestEnvironment,
    redirectUri = `${location.protocol}//${location.host}/callback`,
    continueTo,
    responseType = 'token',
    locale,
    state
  }: IConfig): void {
    if (!clientId) {
      throw new Error('Need a clientId to initialize');
    }

    this.params = {
      client_id: clientId,
      locale,
      continue: continueTo
    };

    this.oauthParams = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
      scope: scope.join(' ') || undefined,
      state
    };

    const subdomain = isTestEnvironment ? 'TEST_SUBDOMAIN' : 'SUBDOMAIN';
    this.domains = {
      vault: `${VAULT[subdomain]}.${DOMAIN}`,
      myaccount: `${MY_ACCOUNT[subdomain]}.${DOMAIN}`
    };

    this.isInitialized = true;
  }

  // Open My Account to authorize application to use MtLink API
  public authorize({ newTab = false, email, authPage, backTo, showAuthToggle }: IMyAccountOptions = {}): void {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized');
    }

    const params = encodeConfigWithParams<IParams | IOauthParams, ICommonUrlConfig & IUrlConfig>(
      { ...this.oauthParams, ...this.params },
      {
        ...commonUrlConfig,
        email,
        auth_action: authPage,
        back_to: backTo,
        show_auth_toggle: showAuthToggle
      }
    );

    window.open(`https://${this.domains.myaccount}/${MY_ACCOUNT.PATHS.OAUTH}${params}`, newTab ? '_blank' : '_self');
  }

  // Open My Account and logs you out from the current session
  public logout({ newTab = false }: IMyAccountOptions = {}): void {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized');
    }

    const params = encodeConfigWithParams<IParams | IOauthParams, ICommonUrlConfig & IUrlConfig>(
      { ...this.oauthParams, ...this.params },
      { ...commonUrlConfig }
    );

    window.open(`https://${this.domains.myaccount}/${MY_ACCOUNT.PATHS.LOGOUT}${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Vault page
  public openVault({ newTab = false, backTo = location.href }: IVaultOptions = {}): void {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized');
    }

    const params = encodeConfigWithParams<IParams, ICommonUrlConfig>(this.params, {
      ...commonUrlConfig,
      back_to: backTo
    });

    window.open(`https://${this.domains.vault}${params}`, newTab ? '_blank' : '_self');
  }

  // Opens a specific service connect page
  public connectService(vaultParams: IVaultService): void {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized');
    }

    if (!vaultParams || typeof vaultParams !== 'object' || !vaultParams.key) {
      throw new Error('Key not provided');
    }

    const { key, newTab = false, backTo = location.href } = vaultParams;

    const params = encodeConfigWithParams<IParams, ICommonUrlConfig>(this.params, {
      ...commonUrlConfig,
      back_to: backTo
    });

    window.open(`https://${this.domains.vault}/${VAULT.PATHS.SERVICE}/${key}${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Guest settings page
  public openSettings({ newTab = false, backTo = location.href }: IMyAccountOptions = {}): void {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized');
    }

    const params = encodeConfigWithParams<IParams, ICommonUrlConfig>(this.params, {
      ...commonUrlConfig,
      back_to: backTo
    });

    window.open(`https://${this.domains.myaccount}/${MY_ACCOUNT.PATHS.SETTINGS}${params}`, newTab ? '_blank' : '_self');
  }
}

// Probably there is no need for this to be a class if initialized here.
export default new LinkSDK();
