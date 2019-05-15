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

interface VaultOptions {
  backTo?: string;
  newTab?: boolean;
}

interface MyaccountOptions {
  backTo?: string;
  newTab?: boolean;
  email?: string;
  authPage?: string;
}

const encodeConfig = (configs: object): string => {
  // My Account separate key/values using semicolon
  return encodeURIComponent(qs.stringify(configs, { delimiter: ';' }));
}

class LinkSDK {
  private domains: { [name: string]: string }
  private params: Params

  init(config: Config): void {
    if (!config.clientId) {
      throw new Error('Need a clientId to initialise');
    }

    const {
      clientId,
      redirectUri = `${location.protocol}//${location.host}/callback`,
      continueTo = '',
      responseType = 'token',
      scope = [],
      locale,
      state
    } = config;

    this.params = {
      client_id: clientId,
      redirect_uri: redirectUri,
      continue: continueTo,
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
  authorize(options: MyaccountOptions = {}): void {
    const { newTab = false, backTo, email, authPage } = options;
    const { PATHS: { OAUTH }} = MY_ACCOUNT;
    const configs = {
      sdk_platform: 'js',
      email,
      auth_action: authPage,
      back_to: backTo,
      show_auth_toggle: true
    };
    const params = qs.stringify({ ...this.params, configs: encodeConfig(configs) }, { encode: false });
    window.open(`https://${this.domains.myaccount}/${OAUTH}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Vault page
  openVault(options: VaultOptions = {}): void {
    const { newTab = false, backTo = location.href } = options;
    const params = qs.stringify({ ...this.params, back_to: backTo });
    window.open(`https://${this.domains.vault}?${params}`, newTab ? '_blank' : '_self');
  }

  // Open the Guest settings page
  openSettings(options: MyaccountOptions = {}): void {
    const { newTab = false, backTo = location.href } = options;
    const { PATHS: { SETTINGS }} = MY_ACCOUNT;
    const configs = {
      sdk_platform: 'js',
      back_to: backTo
    };
    const params = qs.stringify({ ...this.params, configs: encodeConfig(configs) }, { encode: false });
    window.open(`https://${this.domains.myaccount}?${params}/${SETTINGS}`, newTab ? '_blank' : '_self');
  }
}

export default new LinkSDK();
