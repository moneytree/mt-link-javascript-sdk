export declare const supportedAuthAction: readonly ["login", "signup"];
export type AuthAction = typeof supportedAuthAction[number];
export interface PrivateParams {
    cobrandClientId?: string;
    samlSubjectId?: string;
}
export interface PrivateConfigsOptions {
    sdkPlatform?: 'ios' | 'android' | 'js';
    sdkVersion?: string;
}
export declare const supportedAuthnMethod: readonly ["passwordless", "sso", "credentials"];
export type AuthnMethod = typeof supportedAuthnMethod[number];
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
export type ConfigsOptionsWithoutIsNewTab = Omit<ConfigsOptions, 'isNewTab'>;
export type VaultViewServiceList = {
    view: 'services-list';
    group?: 'grouping_bank' | 'grouping_bank_credit_card' | 'grouping_bank_dc_card' | 'grouping_corporate_credit_card' | 'grouping_credit_card' | 'grouping_credit_coop' | 'grouping_credit_union' | 'grouping_dc_pension_plan' | 'grouping_debit_card' | 'grouping_digital_money' | 'grouping_ja_bank' | 'grouping_life_insurance' | 'grouping_point' | 'grouping_regional_bank' | 'grouping_stock' | 'grouping_testing';
    type?: 'bank' | 'credit_card' | 'stored_value' | 'point' | 'corporate';
    search?: string;
};
export type VaultViewServiceConnection = {
    view: 'service-connection';
    entityKey: string;
};
export type VaultViewConnectionSetting = {
    view: 'connection-setting';
    credentialId: string;
};
export type VaultViewConnectionUpdate = {
    view: 'connection-update';
    credentialId: string;
};
export type VaultViewConnectionDelete = {
    view: 'connection-delete';
    credentialId: string;
};
export type VaultViewCustomerSupport = {
    view: 'customer-support';
};
export type VaultServiceTypes = VaultViewServiceList | VaultViewServiceConnection | VaultViewConnectionSetting | VaultViewConnectionUpdate | VaultViewConnectionDelete | VaultViewCustomerSupport;
export type MyAccountServiceTypes = {
    view: LoginLinkTo;
};
export type MyAccountOpenServiceOptions = ConfigsOptions | (ConfigsOptions & MyAccountServiceTypes);
export type MyAccountOpenServiceUrlOptions = ConfigsOptionsWithoutIsNewTab | (ConfigsOptionsWithoutIsNewTab & MyAccountServiceTypes);
export type VaultOpenServiceViewServiceList = ConfigsOptions & VaultViewServiceList;
export type VaultOpenServiceViewServiceConnection = ConfigsOptions & VaultViewServiceConnection;
export type VaultOpenServiceViewConnectionSetting = ConfigsOptions & VaultViewConnectionSetting;
export type VaultOpenServiceViewConnectionUpdate = ConfigsOptions & VaultViewConnectionUpdate;
export type VaultOpenServiceViewConnectionDelete = ConfigsOptions & VaultViewConnectionDelete;
export type VaultOpenServiceViewCustomerSupport = ConfigsOptions & VaultViewCustomerSupport;
export type VaultOpenServiceUrlViewServiceList = ConfigsOptionsWithoutIsNewTab & VaultViewServiceList;
export type VaultOpenServiceUrlViewServiceConnection = ConfigsOptionsWithoutIsNewTab & VaultViewServiceConnection;
export type VaultOpenServiceUrlViewConnectionSetting = ConfigsOptionsWithoutIsNewTab & VaultViewConnectionSetting;
export type VaultOpenServiceUrlViewConnectionUpdate = ConfigsOptionsWithoutIsNewTab & VaultViewConnectionUpdate;
export type VaultOpenServiceUrlViewConnectionDelete = ConfigsOptionsWithoutIsNewTab & VaultViewConnectionDelete;
export type VaultOpenServiceUrlViewCustomerSupport = ConfigsOptionsWithoutIsNewTab & VaultViewCustomerSupport;
export type LinkKitOpenServiceOptions = ConfigsOptions;
export type LinkKitOpenServiceUrlOptions = ConfigsOptionsWithoutIsNewTab;
export type OpenServiceOptions = MyAccountOpenServiceOptions | ConfigsOptions | VaultOpenServiceViewServiceList | VaultOpenServiceViewConnectionSetting | VaultOpenServiceViewConnectionUpdate | VaultOpenServiceViewConnectionDelete | VaultOpenServiceViewCustomerSupport | LinkKitOpenServiceOptions;
export type OpenServiceUrlOptions = MyAccountOpenServiceUrlOptions | ConfigsOptionsWithoutIsNewTab | VaultOpenServiceUrlViewServiceList | VaultOpenServiceUrlViewConnectionSetting | VaultOpenServiceUrlViewConnectionUpdate | VaultOpenServiceUrlViewConnectionDelete | VaultOpenServiceUrlViewCustomerSupport | LinkKitOpenServiceUrlOptions;
export type Scopes = string | string[];
interface AuthorizeConfigsOptions {
    forceLogout?: boolean;
}
export interface OAuthSharedParams {
    state?: string;
    redirectUri?: string;
}
export interface AuthorizeOptions extends OAuthSharedParams, ConfigsOptions, AuthorizeConfigsOptions {
    scopes?: Scopes;
    codeChallenge?: string;
}
export type AuthorizeUrlOptions = Omit<AuthorizeOptions, 'isNewTab'>;
export type Mode = 'production' | 'staging' | 'develop' | 'local';
export type InitOptions = Omit<Omit<AuthorizeOptions, 'forceLogout'>, 'codeChallenge'> & PrivateParams & {
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
export type LogoutOptions = ConfigsOptions;
export type LogoutUrlOptions = Omit<ConfigsOptions, 'isNewTab'>;
export type OnboardOptions = Omit<Omit<Omit<Omit<AuthorizeOptions, 'showAuthToggle'>, 'forceLogout'>, 'showRememberMe'>, 'authAction'>;
export type OnboardUrlOptions = Omit<OnboardOptions, 'isNewTab'>;
export type ServiceId = 'vault' | 'myaccount' | 'link-kit';
export type LoginLinkTo = 'settings' | 'settings/authorized-applications' | 'settings/change-language' | 'settings/email-preferences' | 'settings/delete-account' | 'settings/update-email' | 'settings/update-password';
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
export interface Token {
    access_token: string;
    refresh_token: string;
    token_type: string;
    created_at: number;
    expires_in: number;
    scope: string;
    resource_server: string;
}
export {};
