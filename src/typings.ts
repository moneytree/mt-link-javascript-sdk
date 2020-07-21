export type AuthAction = 'login' | 'signup';

export interface PrivateParams {
  cobrandClientId?: string;
}

export interface PrivateConfigsOptions {
  sdkPlatform?: 'ios' | 'android' | 'js';
  sdkVersion?: string; // semver
}

export interface ConfigsOptions extends PrivateConfigsOptions {
  email?: string;
  backTo?: string;
  authAction?: AuthAction;
  showAuthToggle?: boolean;
  showRememberMe?: boolean;
  isNewTab?: boolean;
}

export type Scopes = string | string[];

interface AuthorizeConfigsOptions {
  forceLogout?: boolean;
}

interface OAuthSharedParams {
  state?: string;
  redirectUri?: string;
  codeVerifier?: string;
}

export interface AuthorizeOptions
  extends OAuthSharedParams,
    ConfigsOptions,
    AuthorizeConfigsOptions {
  country?: string;
  scopes?: Scopes;
}

export type Mode = 'production' | 'staging' | 'develop' | 'local';
export type InitOptions = Omit<AuthorizeOptions, 'forceLogout'> &
  PrivateParams & {
    mode?: Mode;
    locale?: string;
  };
export interface StoredOptions extends InitOptions {
  clientId?: string;
  mode: Mode;
  codeVerifier: string;
  state: string;
}

export interface ExchangeTokenOptions extends OAuthSharedParams {
  code?: string;
}

export type LogoutOptions = ConfigsOptions;

export type OnboardOptions = Omit<
  Omit<Omit<Omit<AuthorizeOptions, 'showAuthToggle'>, 'forceLogout'>, 'showRememberMe'>,
  'authAction'
>;

export type ServiceId = string | 'vault' | 'myaccount-settings' | 'linkkit';

export type MagicLinkTo =
  | string
  | 'settings'
  | 'settings/authorized-applications'
  | 'settings/change-language'
  | 'settings/email-preferences'
  | 'settings/delete-account'
  | 'settings/update-email'
  | 'settings/update-password';

export interface RequestMagicLinkOptions extends ConfigsOptions {
  magicLinkTo?: MagicLinkTo;
}

export type TokenInfoOptions = Omit<Omit<OAuthSharedParams, 'state'>, 'codeVerifier'>;

export interface TokenInfo {
  guestUid: string;
  resourceServer: string;
  country: string;
  currency: string;
  language: string;
  clientName: string;
  clientId: string;
  expTimestamp: number;
  scopes: Scopes;
  isMtClient: boolean;
}
