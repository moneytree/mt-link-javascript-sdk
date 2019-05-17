import * as qs from 'qs';

import { MY_ACCOUNT, VAULT } from './endpoints';
import { extractConfigsFromOptionsOrDefault, getServerHostByEnvironment, IParams } from './helpers';

export interface ISDKConfigOptions {
  newTab?: boolean;
  isTestEnvironment?: boolean;
  locale?: string;
  state?: string;
}

// sdk authorize method options
interface IAuthorizeOptions {
  redirectUri?: string;
  scope?: string[];
  responseType?: 'code' | 'token';
  state?: string;
}

// config key of the server query parameters
export interface IParamConfigsOptions {
  authPage?: 'login' | 'signup';
  email?: string;
  backTo?: string;
  showAuthToggle?: boolean;
}

interface IInitConfig extends IAuthorizeOptions, ISDKConfigOptions, IParamConfigsOptions {
  clientId: string;
}

export interface IAuthorizeParams {
  clientId: string;
  redirectUri: string;
  scope: string[];
  responseType: 'code' | 'token';
  state?: string;
}

class LinkSDK {
  private authorizeParams: IAuthorizeParams = {} as IAuthorizeParams;
  private commonParams: ISDKConfigOptions = {};
  private configsParams: IParamConfigsOptions = {};

  public init(config: IInitConfig) {
    const { clientId } = config;

    if (!clientId) {
      throw new Error('[mt-link-javascript-sdk] Missing "clientId" in init parameter config.');
    }

    const {
      // oauth2
      state,
      responseType = 'token',
      redirectUri = `${location.protocol}//${location.host}/callback`,
      scope = [],

      // configs
      email,
      backTo = location.href,
      authPage = 'login',
      showAuthToggle = true,

      // sdk specific
      isTestEnvironment = false,
      newTab = false,
      locale
    } = config;

    this.authorizeParams = { state, clientId, redirectUri, scope, responseType };
    this.commonParams = { locale, newTab, isTestEnvironment };
    this.configsParams = { email, backTo, authPage, showAuthToggle };
  }

  // Open My Account to authorize application to use MtLink API
  public authorize(options: IAuthorizeOptions & IParamConfigsOptions & ISDKConfigOptions = {}) {
    const { authorizeParams, commonParams } = this;

    if (!authorizeParams.clientId) {
      throw new Error('[mt-link-javascript-sdk] Calling "authorize" without first calling "init".');
    }

    const {
      // oauth2
      redirectUri = authorizeParams.redirectUri,
      scope = authorizeParams.scope,
      responseType = authorizeParams.responseType,
      state = authorizeParams.state,

      // sdk specific
      locale = commonParams.locale,
      isTestEnvironment = commonParams.isTestEnvironment,
      newTab = commonParams.newTab
    } = options;

    const params = qs.stringify({
      client_id: authorizeParams.clientId,
      scope: scope && scope.length ? scope.join(' ') : undefined,
      state,
      locale,
      redirect_uri: redirectUri,
      response_type: responseType,
      configs: extractConfigsFromOptionsOrDefault(options as IParams, this.configsParams as IParams)
    });

    const domain = getServerHostByEnvironment(MY_ACCOUNT, isTestEnvironment);
    window.open(`${domain}/${MY_ACCOUNT.PATHS.OAUTH}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Vault page
  public openVault(options: IParamConfigsOptions & ISDKConfigOptions = {}) {
    const { authorizeParams, commonParams } = this;

    if (!authorizeParams.clientId) {
      throw new Error('[mt-link-javascript-sdk] Calling "openVault" without first calling "init".');
    }

    const {
      // sdk specific
      state,
      locale = commonParams.locale,
      isTestEnvironment = commonParams.isTestEnvironment,
      newTab = commonParams.newTab
    } = options;

    const params = qs.stringify({
      state,
      locale,
      client_id: authorizeParams.clientId,
      configs: extractConfigsFromOptionsOrDefault(options as IParams, this.configsParams as IParams)
    });

    const domain = getServerHostByEnvironment(VAULT, isTestEnvironment);
    window.open(`${domain}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Guest settings page
  public openSettings(options: IParamConfigsOptions & ISDKConfigOptions = {}) {
    const { authorizeParams, commonParams } = this;

    if (!authorizeParams.clientId) {
      throw new Error('[mt-link-javascript-sdk] Calling "openSettings" without first calling "init".');
    }

    const {
      // sdk specific
      state,
      locale = commonParams.locale,
      isTestEnvironment = commonParams.isTestEnvironment,
      newTab = commonParams.newTab
    } = options;

    const params = qs.stringify({
      state,
      locale,
      client_id: authorizeParams.clientId,
      configs: extractConfigsFromOptionsOrDefault(options as IParams, this.configsParams as IParams)
    });

    const domain = getServerHostByEnvironment(MY_ACCOUNT, isTestEnvironment);
    window.open(`${domain}/${MY_ACCOUNT.PATHS.SETTINGS}?${params}`, newTab ? '_blank' : '_self');
  }
}

export default new LinkSDK();
