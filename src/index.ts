import authorize from './api/authorize';
import authorizeUrl from './api/authorize-url';
import onboard from './api/onboard';
import onboardUrl from './api/onboard-url';
import logout from './api/logout';
import logoutUrl from './api/logout-url';
import openService from './api/open-service';
import openServiceUrl from './api/open-service-url';
import requestLoginLink from './api/request-login-link';
import exchangeToken from './api/exchange-token';
import tokenInfo from './api/token-info';
import {
  Token,
  StoredOptions,
  ServiceId,
  LogoutOptions,
  InitOptions,
  AuthorizeOptions,
  OnboardOptions,
  ExchangeTokenOptions,
  RequestLoginLinkOptions,
  TokenInfo,
  Mode,
  AuthorizeUrlOptions,
  LogoutUrlOptions,
  OnboardUrlOptions,
  OpenServiceUrlOptions,
  LinkKitOpenServiceUrlOptions,
  MyAccountOpenServiceUrlOptions,
  LinkKitOpenServiceOptions,
  MyAccountOpenServiceOptions,
  OpenServiceOptions,
  ConfigsOptions,
  ConfigsOptionsWithoutIsNewTab,
  VaultOpenServiceUrlViewServiceList,
  VaultOpenServiceUrlViewServiceConnection,
  VaultOpenServiceUrlViewConnectionSetting,
  VaultOpenServiceUrlViewCustomerSupport,
  VaultOpenServiceViewServiceList,
  VaultOpenServiceViewServiceConnection,
  VaultOpenServiceViewConnectionSetting,
  VaultOpenServiceViewCustomerSupport
} from './typings';

export * from './typings';

const validModes: Mode[] = ['production', 'staging', 'develop', 'local'];

export class MtLinkSdk {
  public storedOptions: StoredOptions = {
    mode: 'production'
  };

  /**
   * Call `init` to initialize the SDK and set default options for API calls.
   *
   * Some LINK APIs can be used without calling `init`.
   * Calls related to OAuth require a client id which can only be set via the `init` function.
   * These APIs include:
   * - {@link authorize}
   * - {@link onboard}
   * - {@link exchangeToken}
   * - {@link tokenInfo}
   *
   * @example
   * ```js
   * mtLinkSdk.init(client_id, options);
   * ```
   * @param clientId - OAuth `clientId` of the app (please request this from your Moneytree representative if you need one).
   *                  <br />⚠️ This function will throw an error if this parameter isn't provided.
   * @param options - Optional parameters for the SDK.
   *                  These options include all of the values below and also all `options` parameters of the other APIs.
   *                  <br />Options values passed here during initialization will be used by default if no options are
   *                  passed when calling a specific API.
   *                  <br />Available options are documented under {@link AuthorizeOptions} and {@link ConfigsOptions}
   *                  refer to each individual link for more details.
   */
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
  /**
   * Use this method to send a guest identifier to Moneytree so that Moneytree can forward it as `saml_subject_id` parameter
   * to the Identity Provider (IdP) via the SAMLRequest during SAML SSO flows. See the [SAML SSO documentation for details](https://docs.link.getmoneytree.com/docs/saml-introduction#saml-subject-identifier).
   *
   * This parameter can be set during {@link init} or changed on a request-by-request basis with this method.
   * The `saml_subject_id` parameter will be forwarded to the `authorize`, `logout` and `open-service` methods when defined.
   */
  public setSamlSubjectId(value: string): void {
    this.storedOptions.samlSubjectId = value;
  }

  /**
   * OAuth authorization method to request guest consent to access data via the [Link API](https://getmoneytree.com/jp/link/about).
   *
   * The only supported flow is authorization code grant with PKCE [PKCE](https://auth0.com/docs/flows/concepts/auth-code-pkce)
   * If the user is not logged in yet this will show the login screen and redirect the guest to the consent screen after they log in.
   * After the guest consents, they will be redirected to the redirect URI with an authorization code.
   * If the user is already logged and has granted consent in the redirection happens immediately.
   *
   * You can pass the {@link AuthorizeOptions.forceLogout} option to force the guest to log in, even if they have an active session.
   *
   * You can also choose to display the sign up form when the user is not logged in yet by setting the {@link AuthorizeOptions.authAction} option.
   *
   * @remark
   * You must initialize the SDK via the {@link init} before calling this API.
   *
   * @example
   * ```javascript
   * mtLinkSdk.authorize(options);
   * ```
   */
  public authorize(options?: AuthorizeOptions): void {
    authorize(this.storedOptions, options);
  }

  /**
   * This method generates an URL for OAuth authorization that requires guest consent to access data via [Link API](https://getmoneytree.com/jp/link/about).
   *
   * See {@link authorize} API for authorization details. This API has exactly the same parameters as {@link authorize},
   * the only difference is that it returns an URL instead of opening immediately with `window.open`.
   */
  public authorizeUrl(options?: AuthorizeUrlOptions): string {
    return authorizeUrl(this.storedOptions, options);
  }

  /**
   * The onboard API allows a new guest to get onboard faster without having to go through the registration process.
   * All you have to do is provide an emai address and pass the same options parameter as the {@link authorize} function.
   * We will display a consent screen explaining the access requests and applicable scopes.
   * Once the guest consents, a new Moneytree account will be created on their behalf and authorization is completed.
   * Resulting behavior will be the same as the {@link authorize} redirection flow.
   *
   * Onboard will force any current guest session to logout, hence you do not have to call {@link logout} manually to
   * ensure a clean state.
   *
   * If an account with this email address already exists we will redirect the guest to the login screen.
   *
   * @remark
   * ⚠️ You must initialize the SDK via the {@link init} before calling this API.
   *
   * ⚠️ For legal reasons, you have to set up your app's terms and conditions URL to use the onboard API.
   * Please ask your Moneytree representative for more details.
   *
   * @throws If the `email` property is not set (via {@link init} or in the `options` parameter of this function).
   */
  public onboard(options?: OnboardOptions): void {
    onboard(this.storedOptions, options);
  }

  /**
   * This method generates a URL for guest onboarding.
   *
   * This API has exactly the same parameters as {@link onboard}, the only difference being that it returns an URL
   * instead of opening immediately with `window.open`.
   */
  public onboardUrl(options?: OnboardUrlOptions): string {
    return onboardUrl(this.storedOptions, options);
  }

  /**
   * Logout current user from Moneytree.
   */
  public logout(options?: LogoutOptions): void {
    logout(this.storedOptions, options);
  }

  /**
   * This method generates a URL to log out the guest.
   *
   * This API has exactly the same parameters as {@link logout}, the only difference being that it returns an URL
   * instead of opening immediately with `window.open`.
   */
  public logoutUrl(options?: LogoutUrlOptions): string {
    return logoutUrl(this.storedOptions, options);
  }

  /**
   * This is a method to open various services provided by Moneytree such as Moneytree account settings, Vault etc.
   *
   * Pass `serviceId: 'link-kit'` to open the LINK Kit service.
   *
   * @remark ⚠️ calling this API before calling {@link init} will open the services view without branding (company logo etc.)
   */
  public openService(serviceId: 'link-kit', options?: LinkKitOpenServiceOptions): void;
  /**
   * Pass `serviceId: 'myaccount'` to open the MyAccount service.
   *
   * Open different MyAccount sub-pages by passing the {@link MyAccountServiceTypes} for all possible options.
   *
   * @remark ⚠️ calling this API before calling {@link init} will open the services view without branding (company logo etc.)
   */
  public openService(serviceId: 'myaccount', options?: MyAccountOpenServiceOptions): void;
  /**
   * Pass `serviceId: 'vault'` to open the Vault service.
   *
   * Depending on the Vault sub-page you want to open, you can pass the following options:
   * - `serviceList`: opens the vault service list page, pass {@link VaultOpenServiceViewServiceList} as options.
   * - `serviceConnection`: opens the vault service connection page, pass {@link VaultOpenServiceViewServiceConnection} as options.
   * - `connectionSetting`: opens the vault connection setting page, pass {@link VaultOpenServiceViewConnectionSetting} as options.
   * - `customerSupport`: opens the vault customer support page, pass {@link VaultOpenServiceViewCustomerSupport} as options.
   *
   * @remark ⚠️ calling this API before calling {@link init} will open the services view without branding (company logo etc.)
   */
  public openService(serviceId: 'vault', options?: ConfigsOptions): void;
  public openService(serviceId: 'vault', options?: VaultOpenServiceViewServiceList): void;
  public openService(serviceId: 'vault', options?: VaultOpenServiceViewServiceConnection): void;
  public openService(serviceId: 'vault', options?: VaultOpenServiceViewConnectionSetting): void;
  public openService(serviceId: 'vault', options?: VaultOpenServiceViewCustomerSupport): void;
  public openService(serviceId: ServiceId, options?: OpenServiceOptions): void {
    switch (serviceId) {
      case 'myaccount':
        openService(this.storedOptions, 'myaccount', options);
        break;
      case 'vault':
        openService(this.storedOptions, 'vault', options);
        break;
      case 'link-kit':
        openService(this.storedOptions, 'link-kit', options);
        break;
      default:
        throw new Error(`[mt-link-sdk] Invalid \`serviceId\` in \`openService\`, got: ${serviceId}`);
    }
  }

  /**
   * This method can generate URLs for various services provided by Moneytree, such as Moneytree Account Settings and Vault.
   *
   * This API has exactly the same parameters as {@link openService}, the only difference being that it returns an URL
   * instead of opening immediately with `window.open`.
   */
  public openServiceUrl(serviceId: 'link-kit', options?: LinkKitOpenServiceUrlOptions): string;
  public openServiceUrl(serviceId: 'myaccount', options?: MyAccountOpenServiceUrlOptions): string;
  public openServiceUrl(serviceId: 'vault', options?: ConfigsOptionsWithoutIsNewTab): string;
  public openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlViewServiceList): string;
  public openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlViewServiceConnection): string;
  public openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlViewConnectionSetting): string;
  public openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlViewCustomerSupport): string;
  public openServiceUrl(serviceId: ServiceId, options?: OpenServiceUrlOptions): string {
    switch (serviceId) {
      case 'myaccount':
        return openServiceUrl(this.storedOptions, 'myaccount', options);
      case 'vault':
        return openServiceUrl(this.storedOptions, 'vault', options);
      case 'link-kit':
        return openServiceUrl(this.storedOptions, 'link-kit', options);
      default:
        throw new Error(`[mt-link-sdk] Invalid \`serviceId\` in \`openServiceUrl\`, got: ${serviceId}`);
    }
  }

  /**
   * Request for a password-less login link to be sent to the guest's email address.
   *
   * Clicking on the link in the email will log a guest in directly to the screen specified by the
   * {@link RequestLoginLinkOptions.loginLinkTo} parameter.
   */
  public requestLoginLink(options?: RequestLoginLinkOptions): Promise<void> {
    return requestLoginLink(this.storedOptions, options);
  }

  /**
   * Use this function to exchange an authorization `code` for a token.
   *
   * You can optionally pass `code` via options parameter, otherwise it will automatically extract the `code` URL
   * parameter of the current URL.
   *
   * The `code` can be used only once. The SDK does not store it internally, you have to store it in your application.
   *
   * One way to use this API is by calling it on your redirection page. For example, if `authorize` redirects to
   * `https://yourapp.com/callback?code=somecode`, you can call this function in the script loaded on that redirection
   * page and the client library will automatically extract the code to exchange for a token.
   *
   * Alternatively, you can extract the `code` manually from the redirect URL and pass it to this function via the
   * options object yourself.
   *
   * If you passed a {@link AuthorizeOptions.codeChallenge} option during the {@link authorize} or {@link onboard}
   * call and wish to exchange the token on the client side application, make sure to set the code verifier used to
   * generate the said `codeChallenge` here.
   *
   * @see [here](https://www.oauth.com/oauth2-servers/pkce/authorization-code-exchange/) for more details.
   *
   * @throws If the {@link ExchangeTokenOptions.code} is not set and the SDK fails to extract it from browser URL.
   * @throws If the {@link ExchangeTokenOptions.redirectUri} is not set and it is not set via {@link init}.
   */
  public exchangeToken(options?: ExchangeTokenOptions): Promise<Token> {
    return exchangeToken(this.storedOptions, options);
  }

  /**
   * Validate a token and get information about the user or resource server.

   * @throws if the token is expired.
   */
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
