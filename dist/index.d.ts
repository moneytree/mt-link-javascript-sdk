import { StoredOptions, LogoutOptions, InitOptions, AuthorizeOptions, OnboardOptions, ExchangeTokenOptions, RequestLoginLinkOptions, TokenInfo, AuthorizeUrlOptions, LogoutUrlOptions, OnboardUrlOptions, LinkKitOpenServiceUrlOptions, MyAccountOpenServiceUrlOptions, VaultOpenServiceUrlOptions, VaultOpenServiceOptions, LinkKitOpenServiceOptions, MyAccountOpenServiceOptions } from './typings';
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
    openService(serviceId: 'vault', options?: VaultOpenServiceOptions): void;
    openServiceUrl(serviceId: 'link-kit', options?: LinkKitOpenServiceUrlOptions): string;
    openServiceUrl(serviceId: 'myaccount', options?: MyAccountOpenServiceUrlOptions): string;
    openServiceUrl(serviceId: 'vault', options?: VaultOpenServiceUrlOptions): string;
    requestLoginLink(options?: RequestLoginLinkOptions): Promise<void>;
    exchangeToken(options?: ExchangeTokenOptions): Promise<string>;
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
