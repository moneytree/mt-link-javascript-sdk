export declare type AuthAction = 'login' | 'signup';
export interface PrivateParams {
    cobrandClientId?: string;
}
export interface PrivateConfigsOptions {
    sdkPlatform?: 'ios' | 'android' | 'js';
    sdkVersion?: string;
}
export interface ConfigsOptions extends PrivateConfigsOptions {
    email?: string;
    backTo?: string;
    authAction?: AuthAction;
    showAuthToggle?: boolean;
    showRememberMe?: boolean;
    isNewTab?: boolean;
}
export declare type ServicesListType = {
    view?: 'services-list';
    group?: 'grouping_bank' | 'grouping_bank_credit_card' | 'grouping_bank_dc_card' | 'grouping_corporate_credit_card' | 'grouping_credit_card' | 'grouping_credit_coop' | 'grouping_credit_union' | 'grouping_dc_pension_plan' | 'grouping_debit_card' | 'grouping_digital_money' | 'grouping_ja_bank' | 'grouping_life_insurance' | 'grouping_point' | 'grouping_regional_bank' | 'grouping_stock' | 'grouping_testing';
    type?: 'bank' | 'credit_card' | 'stored_value' | 'point' | 'corporate';
    search?: string;
};
export declare type ServiceConnectionType = {
    view?: 'service-connection';
    entityKey: string;
};
export declare type ConnectionSettingType = {
    view?: 'connection-setting';
    credentialId: string;
};
export declare type CustomerSupportType = {
    view?: 'customer-support';
};
export declare type OpenServicesConfigsOptions = ConfigsOptions & (ServicesListType | ServiceConnectionType | ConnectionSettingType | CustomerSupportType);
export declare type Scopes = string | string[];
interface AuthorizeConfigsOptions {
    forceLogout?: boolean;
}
interface OAuthSharedParams {
    state?: string;
    redirectUri?: string;
}
export interface AuthorizeOptions extends OAuthSharedParams, ConfigsOptions, AuthorizeConfigsOptions {
    country?: string;
    scopes?: Scopes;
    codeChallenge?: string;
    pkce?: boolean;
}
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
export declare type OnboardOptions = Omit<Omit<Omit<Omit<AuthorizeOptions, 'showAuthToggle'>, 'forceLogout'>, 'showRememberMe'>, 'authAction'>;
export declare type ServiceId = string | 'vault' | 'myaccount-settings' | 'linkkit';
export declare type MagicLinkTo = string | 'settings' | 'settings/authorized-applications' | 'settings/change-language' | 'settings/email-preferences' | 'settings/delete-account' | 'settings/update-email' | 'settings/update-password';
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
export {};
