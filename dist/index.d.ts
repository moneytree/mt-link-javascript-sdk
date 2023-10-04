import { Token, StoredOptions, LogoutOptions, InitOptions, AuthorizeOptions, OnboardOptions, ExchangeTokenOptions, RequestLoginLinkOptions, TokenInfo, AuthorizeUrlOptions, LogoutUrlOptions, OnboardUrlOptions, LinkKitOpenServiceUrlOptions, MyAccountOpenServiceUrlOptions, LinkKitOpenServiceOptions, MyAccountOpenServiceOptions, ConfigsOptions, ConfigsOptionsWithoutIsNewTab, VaultOpenServiceUrlViewServiceList, VaultOpenServiceUrlViewServiceConnection, VaultOpenServiceUrlViewConnectionSetting, VaultOpenServiceUrlViewCustomerSupport, VaultOpenServiceViewServiceList, VaultOpenServiceViewServiceConnection, VaultOpenServiceViewConnectionSetting, VaultOpenServiceViewCustomerSupport } from './typings';
export * from './typings';
export declare class MtLinkSdk {
    storedOptions: StoredOptions;
    init(clientId: string, options?: InitOptions): void;
    setSamlSubjectId(value: string): void;
    authorize(options?: AuthorizeOptions): void;
    authorizeUrl(options?: AuthorizeUrlOptions): string;
    onboard(options?: OnboardOptions): void;
    onboardUrl(options?: OnboardUrlOptions): string;
    logout(options?: LogoutOptions): void;
    logoutUrl(options?: LogoutUrlOptions): string;
    openService(serviceId: 'link-kit', options?: LinkKitOpenServiceOptions): void;
    openService(serviceId: 'myaccount', options?: MyAccountOpenServiceOptions): void;
    openService(serviceId: 'vault', options?: ConfigsOptions): void;
    openService(serviceId: 'vault', options?: VaultOpenServiceViewServiceList): void;
    openService(serviceId: 'vault', options?: VaultOpenServiceViewServiceConnection): void;
    openService(serviceId: 'vault', options?: VaultOpenServiceViewConnectionSetting): void;
    openService(serviceId: 'vault', options?: VaultOpenServiceViewCustomerSupport): void;
    openServiceUrl(serviceId: 'link-kit', options?: LinkKitOpenServiceUrlOptions): string;
    openServiceUrl(serviceId: 'myaccount', options?: MyAccountOpenServiceUrlOptions): string;
    openServiceUrl(serviceId: 'vault', options?: ConfigsOptionsWithoutIsNewTab): string;
    openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlViewServiceList): string;
    openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlViewServiceConnection): string;
    openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlViewConnectionSetting): string;
    openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlViewCustomerSupport): string;
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
