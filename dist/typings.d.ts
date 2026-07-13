export declare const supportedAuthAction: readonly ["login", "signup"];
export type AuthAction = typeof supportedAuthAction[number];
export interface PrivateParams {
    cobrandClientId?: string;
    samlSubjectId?: string;
}
export interface PrivateConfigsOptions {
    sdkPlatform?: 'ios' | 'android' | 'js';
    sdkVersion?: string;
    emailToken?: string;
}
export declare const supportedAuthnMethod: readonly ["passwordless", "sso", "credentials", "otp"];
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
export type VaultViewOnboarding = {
    view: 'onboarding';
};
export type VaultServiceTypes = VaultViewServiceList | VaultViewServiceConnection | VaultViewConnectionSetting | VaultViewConnectionUpdate | VaultViewConnectionDelete | VaultViewCustomerSupport | VaultViewOnboarding;
export interface VaultSpecificOptions {
    showBackBarOn?: Pick<VaultViewServiceList, 'view'> | VaultViewConnectionSetting;
}
export type MyAccountServiceTypes = {
    view: LoginLinkTo;
};
export type MyAccountOpenServiceOptions = ConfigsOptions | (ConfigsOptions & MyAccountServiceTypes);
export type MyAccountOpenServiceUrlOptions = ConfigsOptionsWithoutIsNewTab | (ConfigsOptionsWithoutIsNewTab & MyAccountServiceTypes);
export type VaultOpenServiceOptions = ConfigsOptions & VaultSpecificOptions;
export type VaultOpenServiceUrlOptions = ConfigsOptionsWithoutIsNewTab & VaultSpecificOptions;
export type VaultOpenServiceViewServiceList = VaultOpenServiceOptions & VaultViewServiceList;
export type VaultOpenServiceViewServiceConnection = VaultOpenServiceOptions & VaultViewServiceConnection;
export type VaultOpenServiceViewConnectionSetting = VaultOpenServiceOptions & VaultViewConnectionSetting;
export type VaultOpenServiceViewConnectionUpdate = VaultOpenServiceOptions & VaultViewConnectionUpdate;
export type VaultOpenServiceViewConnectionDelete = VaultOpenServiceOptions & VaultViewConnectionDelete;
export type VaultOpenServiceViewCustomerSupport = VaultOpenServiceOptions & VaultViewCustomerSupport;
export type VaultOpenServiceViewOnboarding = ConfigsOptions & VaultViewOnboarding;
export type VaultOpenServiceUrlViewServiceList = VaultOpenServiceUrlOptions & VaultViewServiceList;
export type VaultOpenServiceUrlViewServiceConnection = VaultOpenServiceUrlOptions & VaultViewServiceConnection;
export type VaultOpenServiceUrlViewConnectionSetting = VaultOpenServiceUrlOptions & VaultViewConnectionSetting;
export type VaultOpenServiceUrlViewConnectionUpdate = VaultOpenServiceUrlOptions & VaultViewConnectionUpdate;
export type VaultOpenServiceUrlViewConnectionDelete = VaultOpenServiceUrlOptions & VaultViewConnectionDelete;
export type VaultOpenServiceUrlViewCustomerSupport = VaultOpenServiceUrlOptions & VaultViewCustomerSupport;
export type VaultOpenServiceUrlViewOnboarding = ConfigsOptionsWithoutIsNewTab & VaultViewOnboarding;
export type LinkKitOpenServiceOptions = ConfigsOptions;
export type LinkKitOpenServiceUrlOptions = ConfigsOptionsWithoutIsNewTab;
export type OpenServiceOptions = MyAccountOpenServiceOptions | VaultOpenServiceOptions | VaultOpenServiceViewServiceList | VaultOpenServiceViewConnectionSetting | VaultOpenServiceViewConnectionUpdate | VaultOpenServiceViewConnectionDelete | VaultOpenServiceViewCustomerSupport | VaultOpenServiceViewOnboarding | LinkKitOpenServiceOptions;
export type OpenServiceUrlOptions = MyAccountOpenServiceUrlOptions | VaultOpenServiceUrlOptions | VaultOpenServiceUrlViewServiceList | VaultOpenServiceUrlViewConnectionSetting | VaultOpenServiceUrlViewConnectionUpdate | VaultOpenServiceUrlViewConnectionDelete | VaultOpenServiceUrlViewCustomerSupport | VaultOpenServiceUrlViewOnboarding | LinkKitOpenServiceUrlOptions;
export type Scopes = string | string[];
interface AuthorizeConfigsOptions {
    forceLogout?: boolean;
}
export interface OAuthSharedParams {
    state?: string;
    redirectUri?: string;
}
export interface AffiliateTrackingParams {
    affiliateCode?: string;
}
export interface AuthorizeOptions extends OAuthSharedParams, ConfigsOptions, AuthorizeConfigsOptions, AffiliateTrackingParams {
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
