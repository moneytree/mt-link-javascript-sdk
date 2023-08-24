export declare const supportedAuthAction: readonly ["login", "signup"];
export declare type AuthAction = typeof supportedAuthAction[number];
export interface PrivateParams {
    cobrandClientId?: string;
    samlSubjectId?: string;
}
export interface PrivateConfigsOptions {
    sdkPlatform?: 'ios' | 'android' | 'js';
    sdkVersion?: string;
}
export declare const supportedAuthnMethod: readonly ["passwordless", "sso", "credentials"];
export declare type AuthnMethod = typeof supportedAuthnMethod[number];
export interface ConfigsOptions extends PrivateConfigsOptions {
    email?: string;
    backTo?: string;
    authAction?: AuthAction;
    showAuthToggle?: boolean;
    showRememberMe?: boolean;
    isNewTab?: boolean;
    forceLogout?: boolean;
    authnMethod?: AuthnMethod;
}
export declare type ConfigsOptionsWithoutIsNewTab = Omit<ConfigsOptions, 'isNewTab'>;
export declare type VaultViewServiceList = {
    view: 'services-list';
    group?: 'grouping_bank' | 'grouping_bank_credit_card' | 'grouping_bank_dc_card' | 'grouping_corporate_credit_card' | 'grouping_credit_card' | 'grouping_credit_coop' | 'grouping_credit_union' | 'grouping_dc_pension_plan' | 'grouping_debit_card' | 'grouping_digital_money' | 'grouping_ja_bank' | 'grouping_life_insurance' | 'grouping_point' | 'grouping_regional_bank' | 'grouping_stock' | 'grouping_testing';
    type?: 'bank' | 'credit_card' | 'stored_value' | 'point' | 'corporate';
    search?: string;
};
export declare type VaultViewServiceConnection = {
    view: 'service-connection';
    entityKey: string;
};
export declare type VaultViewConnectionSetting = {
    view: 'connection-setting';
    credentialId: string;
};
export declare type VaultViewCustomerSupport = {
    view: 'customer-support';
};
export declare type VaultServiceTypes = VaultViewServiceList | VaultViewServiceConnection | VaultViewConnectionSetting | VaultViewCustomerSupport;
export declare type MyAccountServiceTypes = {
    view: LoginLinkTo;
};
export declare type MyAccountOpenServiceOptions = ConfigsOptions | (ConfigsOptions & MyAccountServiceTypes);
export declare type MyAccountOpenServiceUrlOptions = ConfigsOptionsWithoutIsNewTab | (ConfigsOptionsWithoutIsNewTab & MyAccountServiceTypes);
export declare type VaultOpenServiceViewServiceList = ConfigsOptions & VaultViewServiceList;
export declare type VaultOpenServiceViewServiceConnection = ConfigsOptions & VaultViewServiceConnection;
export declare type VaultOpenServiceViewConnectionSetting = ConfigsOptions & VaultViewConnectionSetting;
export declare type VaultOpenServiceViewCustomerSupport = ConfigsOptions & VaultViewCustomerSupport;
export declare type VaultOpenServiceUrlViewServiceList = ConfigsOptionsWithoutIsNewTab & VaultViewServiceList;
export declare type VaultOpenServiceUrlViewServiceConnection = ConfigsOptionsWithoutIsNewTab & VaultViewServiceConnection;
export declare type VaultOpenServiceUrlViewConnectionSetting = ConfigsOptionsWithoutIsNewTab & VaultViewConnectionSetting;
export declare type VaultOpenServiceUrlViewCustomerSupport = ConfigsOptionsWithoutIsNewTab & VaultViewCustomerSupport;
export declare type LinkKitOpenServiceOptions = ConfigsOptions;
export declare type LinkKitOpenServiceUrlOptions = ConfigsOptionsWithoutIsNewTab;
export declare type OpenServiceOptions = MyAccountOpenServiceOptions | ConfigsOptions | VaultOpenServiceViewServiceList | VaultOpenServiceViewConnectionSetting | VaultOpenServiceViewCustomerSupport | LinkKitOpenServiceOptions;
export declare type OpenServiceUrlOptions = MyAccountOpenServiceUrlOptions | ConfigsOptionsWithoutIsNewTab | VaultOpenServiceUrlViewServiceList | VaultOpenServiceUrlViewConnectionSetting | VaultOpenServiceUrlViewCustomerSupport | LinkKitOpenServiceUrlOptions;
export declare type Scopes = string | string[];
interface AuthorizeConfigsOptions {
    forceLogout?: boolean;
}
interface OAuthSharedParams {
    state?: string;
    redirectUri?: string;
}
export interface AuthorizeOptions extends OAuthSharedParams, ConfigsOptions, AuthorizeConfigsOptions {
    scopes?: Scopes;
    codeChallenge?: string;
    pkce?: boolean;
}
export declare type AuthorizeUrlOptions = Omit<AuthorizeOptions, 'isNewTab'>;
export declare type Mode = 'production' | 'staging' | 'develop' | 'local';
export declare type InitOptions = Omit<Omit<Omit<AuthorizeOptions, 'forceLogout'>, 'codeChallenge'>, 'pkce'> & PrivateParams & {
    mode?: Mode;
    locale?: string;
};
export interface StoredOptions extends InitOptions {
    clientId?: string;
    mode: Mode;
}
export interface ExchangeTokenOptions extends OAuthSharedParams {
    code?: string;
    codeVerifier?: string;
}
export declare type LogoutOptions = ConfigsOptions;
export declare type LogoutUrlOptions = Omit<ConfigsOptions, 'isNewTab'>;
export declare type OnboardOptions = Omit<Omit<Omit<Omit<AuthorizeOptions, 'showAuthToggle'>, 'forceLogout'>, 'showRememberMe'>, 'authAction'>;
export declare type OnboardUrlOptions = Omit<OnboardOptions, 'isNewTab'>;
export declare type ServiceId = 'vault' | 'myaccount' | 'link-kit';
export declare type LoginLinkTo = 'settings' | 'settings/authorized-applications' | 'settings/change-language' | 'settings/email-preferences' | 'settings/delete-account' | 'settings/update-email' | 'settings/update-password';
export interface RequestLoginLinkOptions extends ConfigsOptions {
    loginLinkTo?: LoginLinkTo;
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
export {};
