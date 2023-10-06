export const supportedAuthAction = ['login', 'signup'] as const;
export type AuthAction = typeof supportedAuthAction[number];

/** @hidden */
export interface PrivateParams {
  /**
   * Brand Moneytree apps with client's branding. E.g: logo or theme.
   * @remarks
   * This is an internal attribute. Please do not use it unless instructed by your integration representative.
   */
  cobrandClientId?: string;
  /**
   * Sets the subject ID for SAML AuthnRequest.
   */
  samlSubjectId?: string;
}

/** @hidden */
export interface PrivateConfigsOptions {
  sdkPlatform?: 'ios' | 'android' | 'js';
  sdkVersion?: string; // semver
}

export const supportedAuthnMethod = ['passwordless', 'sso', 'credentials'] as const;
export type AuthnMethod = typeof supportedAuthnMethod[number];

export interface ConfigsOptions extends PrivateConfigsOptions {
  /**
   * Email address to pre-fill the email field in login or sign up or form.
   *
   * Set the default value via {@link MtLinkSdk.init}
   */
  email?: string;
  /**
   * A redirection URL for redirecting a user back to in one of the following conditions:
   * - User clicks on `Back to [App Name]` button in any Moneytree screen.
   * - User refuses to give consent to access permission in the consent screen.
   * - User logs out from Moneytree via an app with this client ID
   * - User revokes consent from settings screen opened via an app with this client ID
   *
   * ⚠️ No `Back to [App Name]` button will be shown if this value is not set, and any of the actions mentioned above will redirect the user back to the login screen by default.
   *
   * Set the default value via {@link MtLinkSdk.init}
   */
  backTo?: string;
  /**
   * Show the login or sign up screen when a session does not exist during an {@link MtLinkSdk.authorize} call.
   *
   * Set default value via {@link MtLinkSdk.init}
   *
   * @defaultValue 'login'
   */
  authAction?: AuthAction;
  /**
   * If you wish to disable the `Login to Sign up` form toggle button and vice-versa in the auth screen, set this to `false`.
   *
   * Set default value via {@link MtLinkSdk.init}
   *
   * @defaultValue true
   */
  showAuthToggle?: boolean;
  /**
   * If you wish to disable the `Stay logged in for 30 days` checkbox in the login screen, set this to `false`.
   *
   * Set default value via {@link MtLinkSdk.init}
   *
   * @defaultValue true
   */
  showRememberMe?: boolean;
  /**
   * Call method and open/render in a new browser tab. By default all views open in the same tab.
   *
   * Set default value via {@link MtLinkSdk.init}
   *
   * @defaultValue false
   */
  isNewTab?: boolean;
  /**
   * Force existing user session to logout and call authorize with a clean state.
   * @defaultValue false
   */
  forceLogout?: boolean;
  /**
   * Use different authentication methods.
   */
  authnMethod?: AuthnMethod;
}
export type ConfigsOptionsWithoutIsNewTab = Omit<ConfigsOptions, 'isNewTab'>;

export type VaultViewServiceList = {
  view: 'services-list';
  /** Filter the services by group */
  group?:
    | 'grouping_bank'
    | 'grouping_bank_credit_card'
    | 'grouping_bank_dc_card'
    | 'grouping_corporate_credit_card'
    | 'grouping_credit_card'
    | 'grouping_credit_coop'
    | 'grouping_credit_union'
    | 'grouping_dc_pension_plan'
    | 'grouping_debit_card'
    | 'grouping_digital_money'
    | 'grouping_ja_bank'
    | 'grouping_life_insurance'
    | 'grouping_point'
    | 'grouping_regional_bank'
    | 'grouping_stock'
    | 'grouping_testing';
  /**
   * Filter the services by type.
   * - `bank` - personal bank
   * - `credit_card` - personal credit card
   * - `stored_value` - electronic money
   * - `point` - loyalty point
   * - `corporate` - corporate bank or credit card
   */
  type?: 'bank' | 'credit_card' | 'stored_value' | 'point' | 'corporate';
  /** Filter the services by the search term */
  search?: string;
};
export type VaultViewServiceConnection = {
  view: 'service-connection';
  /**
   * Service entity key.
   * @remark ⚠️ If entityKey is invalid the Vault top page will be shown.
   */
  entityKey: string;
};
export type VaultViewConnectionSetting = {
  view: 'connection-setting';
  /**
   * Credential ID.
   * @remark ⚠️ If credentialId is invalid the Vault top page will be shown.
   */
  credentialId: string;
};
export type VaultViewCustomerSupport = { view: 'customer-support' };
export type VaultServiceTypes =
  | VaultViewServiceList
  | VaultViewServiceConnection
  | VaultViewConnectionSetting
  | VaultViewCustomerSupport;

export type MyAccountServiceTypes = {
  /**
   * Directly go to the chosen page. Currently supported locations include:
   *
   * @defaultValue 'settings' // on mobile
   * @defaultValue 'settings/update-email' // on desktop
   */
  view: LoginLinkTo;
};

export type MyAccountOpenServiceOptions = ConfigsOptions | (ConfigsOptions & MyAccountServiceTypes);
export type MyAccountOpenServiceUrlOptions =
  | ConfigsOptionsWithoutIsNewTab
  | (ConfigsOptionsWithoutIsNewTab & MyAccountServiceTypes);

export type VaultOpenServiceViewServiceList = ConfigsOptions & VaultViewServiceList;
export type VaultOpenServiceViewServiceConnection = ConfigsOptions & VaultViewServiceConnection;
export type VaultOpenServiceViewConnectionSetting = ConfigsOptions & VaultViewConnectionSetting;
export type VaultOpenServiceViewCustomerSupport = ConfigsOptions & VaultViewCustomerSupport;
export type VaultOpenServiceUrlViewServiceList = ConfigsOptionsWithoutIsNewTab & VaultViewServiceList;
export type VaultOpenServiceUrlViewServiceConnection = ConfigsOptionsWithoutIsNewTab & VaultViewServiceConnection;
export type VaultOpenServiceUrlViewConnectionSetting = ConfigsOptionsWithoutIsNewTab & VaultViewConnectionSetting;
export type VaultOpenServiceUrlViewCustomerSupport = ConfigsOptionsWithoutIsNewTab & VaultViewCustomerSupport;

export type LinkKitOpenServiceOptions = ConfigsOptions;
export type LinkKitOpenServiceUrlOptions = ConfigsOptionsWithoutIsNewTab;

export type OpenServiceOptions =
  | MyAccountOpenServiceOptions
  | ConfigsOptions
  | VaultOpenServiceViewServiceList
  | VaultOpenServiceViewConnectionSetting
  | VaultOpenServiceViewCustomerSupport
  | LinkKitOpenServiceOptions;
export type OpenServiceUrlOptions =
  | MyAccountOpenServiceUrlOptions
  | ConfigsOptionsWithoutIsNewTab
  | VaultOpenServiceUrlViewServiceList
  | VaultOpenServiceUrlViewConnectionSetting
  | VaultOpenServiceUrlViewCustomerSupport
  | LinkKitOpenServiceUrlOptions;

export type Scopes = string | string[];

interface AuthorizeConfigsOptions {
  forceLogout?: boolean;
}

export interface OAuthSharedParams {
  /**
   * The state parameter for OAuth flows, see [here](https://auth0.com/docs/protocols/oauth2/oauth-state) for more details.
   *
   * If you generate an identifier for the OAuth authorization on your server make sure to set this value explicitly so
   * that you can use it to acquire the access token after the OAuth redirect occurs.
   *
   * The default value is a randomly generated [uuid](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)), or set via {@link MtLinkSdk.init}
   */
  state?: string;
  /**
   * OAuth redirection URI, see [here](https://www.oauth.com/oauth2-servers/redirect-uris/) for more details.
   *
   * Set the default value via {@link MtLinkSdk.init}
   */
  redirectUri?: string;
}

export interface AuthorizeOptions extends OAuthSharedParams, ConfigsOptions, AuthorizeConfigsOptions {
  /**
   * Access scopes you're requesting. This can be a single scope, or an array of scopes.
   *
   * Currently supported scopes are:
   * - guest_read
   * - accounts_read
   * - points_read
   * - point_transactions_read
   * - transactions_read
   * - transactions_write
   * - expense_claims_read
   * - categories_read
   * - investment_accounts_read
   * - investment_transactions_read
   * - notifications_read
   * - request_refresh
   * - life_insurance_read
   *
   * See the [LINK Platform documentation](https://docs.link.getmoneytree.com/docs/api-scopes) for more details
   *
   * @defaultValue `'guest_read'`, or set via {@link MtLinkSdk.init}
   */
  scopes?: Scopes;
  /**
   * The code challenge for [PKCE flow](https://auth0.com/docs/api-auth/tutorials/authorization-code-grant-pkce).
   *
   * ⚠️ **Only set this if you are exchanging the code on your backend.** If you are exchanging the code on the frontend,
   * the SDK handles this for you.
   *
   * We only support SHA256 as code challenge method, therefore please ensure the code_challenge was generated using the
   * SHA256 hash algorithm.
   */
  codeChallenge?: string;
  /** @hidden */
  pkce?: boolean;
}

export type AuthorizeUrlOptions = Omit<AuthorizeOptions, 'isNewTab'>;

export type Mode = 'production' | 'staging' | 'develop' | 'local';
export type InitOptions = Omit<Omit<Omit<AuthorizeOptions, 'forceLogout'>, 'codeChallenge'>, 'pkce'> &
  PrivateParams & {
    /**
     * Environment for the SDK to connect to, the SDK will connect to the Moneytree production server by default.
     * - Moneytree clients should use `staging` for development as `develop` may contain unstable features.
     * - `local` is only for SDK development by Moneytree engineers.
     */
    mode?: Mode;
    /**
     * Force Moneytree to load content in this specific locale.
     *
     * A default value will be auto detected based on the user's language configuration and location if available.
     * Check this [spec](https://www.w3.org/TR/html401/struct/dirlang.html#h-8.1.1) for more information.
     *
     * Currently supported values are:`'en'`, `'en-AU'`, `'ja'`.
     */
    locale?: string;
  };

export interface StoredOptions extends InitOptions {
  clientId?: string;
  mode: Mode;
}
export interface ExchangeTokenOptions extends OAuthSharedParams {
  /**
   * Authorization code from OAuth redirection used to exchange for a token.
   */
  code?: string;
  /**
   * PKCE Code verifier used to exchange for a token.
   */
  codeVerifier?: string;
}

export type LogoutOptions = ConfigsOptions;
export type LogoutUrlOptions = Omit<ConfigsOptions, 'isNewTab'>;

/**
 * Options for Onboarding.
 *
 * Most options are the same as the {@link AuthorizeOptions} with a few exceptions.
 *
 * Unsupported options are:
 * - `showAuthToggle`.
 * - `forceLogout`.
 * - `showRememberMe`
 * - `authAction`
 *
 * @remark
 * ⚠️ SDK will throw an error if both values here and from the init options are undefined.
 *
 * @see {@link AuthorizeOptions}
 */
export type OnboardOptions = Omit<
  Omit<Omit<Omit<AuthorizeOptions, 'showAuthToggle'>, 'forceLogout'>, 'showRememberMe'>,
  'authAction'
>;

export type OnboardUrlOptions = Omit<OnboardOptions, 'isNewTab'>;

export type ServiceId = 'vault' | 'myaccount' | 'link-kit';

/**
 * - `settings` - Main Moneytree account settings screen.
 * - `settings/authorized-applications` - List of apps currently connected to the Moneytree account.
 * - `settings/change-language` - Change Moneytree account language screen.
 * - `settings/email-preferences` - Change Moneytree account email preferences screen.
 * - `settings/delete-account` - Delete Moneytree account screen.
 * - `settings/update-email` - Change Moneytree account email screen.
 * - `settings/update-password` - Change Moneytree account password screen.
 */
export type LoginLinkTo =
  | 'settings'
  | 'settings/authorized-applications'
  | 'settings/change-language'
  | 'settings/email-preferences'
  | 'settings/delete-account'
  | 'settings/update-email'
  | 'settings/update-password';

export interface RequestLoginLinkOptions extends ConfigsOptions {
  loginLinkTo?: LoginLinkTo;
}

export interface TokenInfo {
  /** token issuer */
  iss: string;
  /** token creation time */
  iat: number;
  /** token expiry */
  exp: number;
  /** token audience(s) */
  aud: string[];
  /** token subject - the Moneytree ID of the user */
  sub: null | string;
  scope: string;
  client_id: null | string;
  /** application related information */
  app: null | {
    /** Application name */
    name: string;
    /** @hidden */
    is_mt: boolean;
  };
  /** User related information */
  guest: null | {
    email: string;
    country: string;
    currency: string;
    lang: string;
  };
}

/** OAuth Access Token Response described in [RFC 6749 section 5.1](https://datatracker.ietf.org/doc/html/rfc6749#section-5.1) */
export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
  /** Creation time of the token, unix timpstamp in seconds */
  created_at: number;
  /**
   * The lifetime in seconds of the access token.
   * For example, the value "3600" denotes that the access token will expire in one hour from the time the response was generated.
   */
  expires_in: number;
  scope: string;
  resource_server: string;
}
