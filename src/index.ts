import { v4 as uuid } from 'uuid';

import authorize from './api/authorize';
import onboard from './api/onboard';
import logout from './api/logout';
import openService from './api/open-service';
import requestMagicLink from './api/request-magic-link';
import exchangeToken from './api/exchange-token';
import tokenInfo from './api/token-info';
import {
  StoredOptions,
  ServiceId,
  ConfigsOptions,
  LogoutOptions,
  InitOptions,
  AuthorizeOptions,
  ExchangeTokenOptions,
  TokenInfoOptions,
  RequestMagicLinkOptions,
  TokenInfo,
  Mode
} from './typings';
import storage from './storage';

export * from './typings';

const validModes: Mode[] = ['production', 'staging', 'develop', 'local'];

export class MtLinkSdk {
  public storedOptions: StoredOptions = {
    mode: 'production',
    state: storage.get('state') || uuid(),
    codeVerifier: storage.get('codeVerifier') || uuid()
  };

  public init(clientId: string, options: InitOptions = {}) {
    if (!clientId) {
      throw new Error('[mt-link-sdk] Missing parameter `client_id` in `init`.');
    }

    const { mode = 'production', ...rest } = options;

    // sdk instance state
    this.storedOptions = {
      ...this.storedOptions,
      ...rest,
      clientId,
      mode: validModes.indexOf(mode) === -1 ? 'production' : mode
    };

    storage.set('state', this.storedOptions.state);
    storage.set('codeVerifier', this.storedOptions.codeVerifier);
  }

  public authorize(options?: AuthorizeOptions): void {
    authorize(this.storedOptions, options);
  }

  public onboard(options?: AuthorizeOptions): void {
    onboard(this.storedOptions, options);
  }

  public logout(options?: LogoutOptions): void {
    logout(this.storedOptions, options);
  }

  public openService(serviceId: ServiceId, options?: ConfigsOptions): void {
    openService(this.storedOptions, serviceId, options);
  }

  public requestMagicLink(options?: RequestMagicLinkOptions): Promise<void> {
    return requestMagicLink(this.storedOptions, options);
  }

  public exchangeToken(options?: ExchangeTokenOptions): Promise<string> {
    return exchangeToken(this.storedOptions, options);
  }

  public tokenInfo(token: string, options?: TokenInfoOptions): Promise<TokenInfo> {
    return tokenInfo(this.storedOptions, token, options);
  }
}

const mtLinkSdk = new MtLinkSdk();

declare global {
  interface Window {
    mtLinkSdk: MtLinkSdk;
    MtLinkSdk: typeof MtLinkSdk;
  }
}

// istanbul ignore next
// NOTE: don't know how to include test coverage for `if (window)`
if (window) {
  window.mtLinkSdk = mtLinkSdk;
  window.MtLinkSdk = MtLinkSdk;
}

export default mtLinkSdk;
