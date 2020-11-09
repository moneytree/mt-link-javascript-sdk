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

export type ServicesListType = {
  view?: 'services-list';
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
  type?: 'bank' | 'credit_card' | 'stored_value' | 'point' | 'corporate';
  search?: string;
};

export type ServiceConnectionType = { view?: 'service-connection'; entityKey: string };

export type ConnectionSettingType = { view?: 'connection-setting'; credentialId: string };

export type CustomerSupportType = { view?: 'customer-support' };

export type OpenServicesConfigsOptions = ConfigsOptions &
  (ServicesListType | ServiceConnectionType | ConnectionSettingType | CustomerSupportType);

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

export interface TokenInfo {
  iss: string;
  iat: number;
  exp: number;
  aud: string[];
  sub: null | string;
  scope: string;
  client_id: null | string;
  app: null | {
    name: string;
    is_mt: boolean;
  };
  guest: null | {
    email: string;
    country: string;
    currency: string;
    lang: string;
  };
}
