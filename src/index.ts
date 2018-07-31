import * as qs from 'qs';
import { DOMAIN, MY_ACCOUNT, VAULT } from './endpoints';

interface Config {
  clientId: string;
  isTestEnvironment?: boolean;
  scope: string[];
  redirectUri?: string;
  responseType?: string;
  appToken?: string;
  locale?: string;
  state?: string;
}

interface Params {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope: string;
  locale?: string;
  access_token?: string;
  state?: string;
}

class LinkSDK {
  private domains: { [name: string]: string }
  private params: Params

  init(config: Config): void {
    if (!config.clientId) {
      throw new Error('Need a clientId to initialise');
    }

    this.params = {
      client_id:config. clientId,
      redirect_uri: config.redirectUri || `${location.protocol}//${location.host}/callback`,
      response_type: config.responseType || 'token',
      scope: config.scope.join(' '),
      access_token: config.appToken,
      locale: config.locale,
      state: config.state
    };

    const subdomain = config.isTestEnvironment ? 'TEST_SUBDOMAIN' : 'SUBDOMAIN';
    this.domains = {
      vault: `${VAULT[subdomain]}.${DOMAIN}`,
      myaccount: `${MY_ACCOUNT[subdomain]}.${DOMAIN}`
    };
  }

  // Set the token from callback or server
  setToken(appToken: string): void {
    this.params.access_token = appToken;
  }

  // Open My Account to authorize application to use MtLink API
  authorize(newTab: boolean = false): void {
    const { PATHS: { OAUTH }} = MY_ACCOUNT;
    const params = qs.stringify(this.params);
    window.open(`https://${this.domains.myaccount}/${OAUTH}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Vault page
  openVault(newTab: boolean = false): void {
    const params = qs.stringify(this.params);
    window.open(`https://${this.domains.vault}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Guest settings page
  openSettings(newTab: boolean = false): void {
    const { PATHS: { SETTINGS }} = MY_ACCOUNT;
    const params = qs.stringify(this.params);
    window.open(`https://${this.domains.myaccount}?${params}/${SETTINGS}`, newTab ? '_blank' : '_self');
  }
}

export default new LinkSDK();
