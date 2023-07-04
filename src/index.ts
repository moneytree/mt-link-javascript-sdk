import authorize from './api/authorize';
import authorizeUrl from './api/authorize-url';
import onboard from './api/onboard';
import logout from './api/logout';
import logoutUrl from './api/logout-url';
import openService from './api/open-service';
import openServiceUrl from './api/open-service-url';
import requestLoginLink from './api/request-login-link';
import exchangeToken from './api/exchange-token';
import tokenInfo from './api/token-info';
import {
  StoredOptions,
  ServiceId,
  OpenServicesConfigsOptions,
  LogoutOptions,
  InitOptions,
  AuthorizeOptions,
  OnboardOptions,
  ExchangeTokenOptions,
  RequestLoginLinkOptions,
  TokenInfo,
  Mode,
  OpenServicesUrlConfigsOptions,
  AuthorizeUrlOptions,
  LogoutUrlOptions
} from './typings';

export * from './typings';

const validModes: Mode[] = ['production', 'staging', 'develop', 'local'];

export class MtLinkSdk {
  public storedOptions: StoredOptions = {
    mode: 'production'
  };

  public init(clientId: string, options: InitOptions = {}): void {
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
  }

  public setSamlSubjectId(value: string): void {
    this.storedOptions.samlSubjectId = value;
  }

  public authorize(options?: AuthorizeOptions): void {
    authorize(this.storedOptions, options);
  }

  public authorizeUrl(options?: AuthorizeUrlOptions): string {
    return authorizeUrl(this.storedOptions, options);
  }

  public onboard(options?: OnboardOptions): void {
    onboard(this.storedOptions, options);
  }

  public logout(options?: LogoutOptions): void {
    logout(this.storedOptions, options);
  }

  public logoutUrl(options?: LogoutUrlOptions): string {
    return logoutUrl(this.storedOptions, options);
  }

  public openService(serviceId: ServiceId, options?: OpenServicesConfigsOptions): void {
    openService(this.storedOptions, serviceId, options);
  }

  public openServiceUrl(serviceId: ServiceId, options?: OpenServicesUrlConfigsOptions): string {
    return openServiceUrl(this.storedOptions, serviceId, options);
  }

  public requestLoginLink(options?: RequestLoginLinkOptions): Promise<void> {
    return requestLoginLink(this.storedOptions, options);
  }

  public exchangeToken(options?: ExchangeTokenOptions): Promise<string> {
    return exchangeToken(this.storedOptions, options);
  }

  public tokenInfo(token: string): Promise<TokenInfo> {
    return tokenInfo(this.storedOptions, token);
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
