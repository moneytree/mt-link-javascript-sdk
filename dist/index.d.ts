import { Token, StoredOptions, LogoutOptions, InitOptions, AuthorizeOptions, OnboardOptions, ExchangeTokenOptions, RequestLoginLinkOptions, TokenInfo, AuthorizeUrlOptions, LogoutUrlOptions, OnboardUrlOptions, LinkKitOpenServiceUrlOptions, MyAccountOpenServiceUrlOptions, LinkKitOpenServiceOptions, MyAccountOpenServiceOptions, VaultOpenServiceOptions, VaultOpenServiceUrlOptions, VaultOpenServiceUrlViewServiceList, VaultOpenServiceUrlViewServiceConnection, VaultOpenServiceUrlViewConnectionSetting, VaultOpenServiceUrlViewCustomerSupport, VaultOpenServiceViewServiceList, VaultOpenServiceViewServiceConnection, VaultOpenServiceViewConnectionSetting, VaultOpenServiceViewCustomerSupport } from './typings';
export * from './typings';
export declare class MtLinkSdk {
    storedOptions: StoredOptions;
    init(clientId: string, options?: InitOptions): void;
    setSamlSubjectId(value: string): void;
    authorize(options?: AuthorizeOptions): Promise<void>;
    authorizeUrl(options?: AuthorizeUrlOptions): Promise<string>;
    onboard(options?: OnboardOptions): Promise<void>;
    onboardUrl(options?: OnboardUrlOptions): Promise<string>;
    logout(options?: LogoutOptions): Promise<void>;
    logoutUrl(options?: LogoutUrlOptions): Promise<string>;
    openService(serviceId: 'link-kit', options?: LinkKitOpenServiceOptions): Promise<void>;
    openService(serviceId: 'myaccount', options?: MyAccountOpenServiceOptions): Promise<void>;
    openService(serviceId: 'vault', options?: VaultOpenServiceOptions): Promise<void>;
    openService(serviceId: 'vault', options?: VaultOpenServiceViewServiceList): Promise<void>;
    openService(serviceId: 'vault', options?: VaultOpenServiceViewServiceConnection): Promise<void>;
    openService(serviceId: 'vault', options?: VaultOpenServiceViewConnectionSetting): Promise<void>;
    openService(serviceId: 'vault', options?: VaultOpenServiceViewCustomerSupport): Promise<void>;
    openServiceUrl(serviceId: 'link-kit', options?: LinkKitOpenServiceUrlOptions): Promise<string>;
    openServiceUrl(serviceId: 'myaccount', options?: MyAccountOpenServiceUrlOptions): Promise<string>;
    openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlOptions): Promise<string>;
    openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlViewServiceList): Promise<string>;
    openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlViewServiceConnection): Promise<string>;
    openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlViewConnectionSetting): Promise<string>;
    openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlViewCustomerSupport): Promise<string>;
    requestLoginLink(options?: RequestLoginLinkOptions): Promise<void>;
    exchangeToken(options?: ExchangeTokenOptions): Promise<Token>;
    tokenInfo(token: string): Promise<TokenInfo>;
}
declare const mtLinkSdk: MtLinkSdk;
declare global {
    interface Window {
        mtLinkSdk: MtLinkSdk;
        MtLinkSdk: typeof MtLinkSdk;
    }
}
export default mtLinkSdk;
