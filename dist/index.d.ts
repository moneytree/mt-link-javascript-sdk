import { StoredOptions, ServiceId, ConfigsOptions, LogoutOptions, InitOptions, AuthorizeOptions, OnboardOptions, ExchangeTokenOptions, RequestMagicLinkOptions, TokenInfo } from './typings';
export * from './typings';
export declare class MtLinkSdk {
    storedOptions: StoredOptions;
    init(clientId: string, options?: InitOptions): void;
    authorize(options?: AuthorizeOptions): void;
    onboard(options?: OnboardOptions): void;
    logout(options?: LogoutOptions): void;
    openService(serviceId: ServiceId, options?: ConfigsOptions): void;
    requestMagicLink(options?: RequestMagicLinkOptions): Promise<void>;
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
