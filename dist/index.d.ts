interface IConfig {
    clientId: string;
    scope?: string[];
    isTestEnvironment?: boolean;
    redirectUri?: string;
    continueTo?: string;
    responseType?: 'code' | 'token';
    locale?: string;
    state?: string;
}
export interface IParams {
    client_id: string;
    locale?: string;
    continue?: string;
}
export interface IOauthParams {
    client_id: string;
    redirect_uri: string;
    response_type: string;
    scope?: string;
    state?: string;
}
export interface IDomains {
    vault: string;
    myaccount: string;
}
interface IVaultOptions {
    backTo?: string;
    newTab?: boolean;
}
interface IVaultService extends IVaultOptions {
    key: string;
}
interface IMyAccountOptions {
    backTo?: string;
    newTab?: boolean;
    email?: string;
    authPage?: string;
    showAuthToggle?: boolean;
}
declare class LinkSDK {
    private domains;
    private params;
    private oauthParams;
    private isInitialized;
    init({ clientId, scope, isTestEnvironment, redirectUri, continueTo, responseType, locale, state }: IConfig): void;
    authorize({ newTab, email, authPage, backTo, showAuthToggle }?: IMyAccountOptions): void;
    logout({ newTab }?: IMyAccountOptions): void;
    openVault({ newTab, backTo }?: IVaultOptions): void;
    connectService(vaultParams: IVaultService): void;
    openSettings({ newTab, backTo }?: IMyAccountOptions): void;
}
declare const _default: LinkSDK;
export default _default;
