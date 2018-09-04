import * as qs from 'qs';
import { DOMAIN, MY_ACCOUNT, VAULT } from './endpoints';

interface Config {
  clientId: string;
  isTestEnvironment?: boolean;
  scope: string[];
  redirectUri?: string;
  continueTo?: string;
  responseType?: string;
  locale?: string;
  state?: string;
}

interface Params {
  client_id: string;
  redirect_uri: string;
  continue: string;
  response_type: string;
  scope: string;
  back?: string;
  locale?: string;
  state?: string;
}

interface LinkOptions {
  backTo?: string,
  newTab?: boolean
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
      continue: config.continueTo || '',
      response_type: config.responseType || 'token',
      scope: config.scope.join(' '),
      locale: config.locale,
      state: config.state
    };

    const subdomain = config.isTestEnvironment ? 'TEST_SUBDOMAIN' : 'SUBDOMAIN';
    this.domains = {
      vault: `${VAULT[subdomain]}.${DOMAIN}`,
      myaccount: `${MY_ACCOUNT[subdomain]}.${DOMAIN}`
    };
  }

  // Open My Account to authorize application to use MtLink API
  authorize({ newTab = false } = {}): void {
    const { PATHS: { OAUTH }} = MY_ACCOUNT;
    const params = qs.stringify({ ...this.params });
    window.open(`https://${this.domains.myaccount}/${OAUTH}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Vault page
  openVault(options: LinkOptions = {}): void {
    const { newTab = false, backTo = location.href } = options;
    const params = qs.stringify({ ...this.params, back: backTo });
    window.open(`https://${this.domains.vault}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Guest settings page
  openSettings(options: LinkOptions = {}): void {
    const { newTab = false, backTo = location.href } = options;
    const { PATHS: { SETTINGS }} = MY_ACCOUNT;
    const params = qs.stringify({ ...this.params, back: backTo });
    window.open(`https://${this.domains.myaccount}?${params}/${SETTINGS}`, newTab ? '_blank' : '_self');
  }
}

export default new LinkSDK();
