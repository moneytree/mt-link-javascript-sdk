import { StoredOptions, ServiceId, OpenServicesConfigsOptions, LogoutOptions, InitOptions, AuthorizeOptions, OnboardOptions, ExchangeTokenOptions, RequestLoginLinkOptions, TokenInfo } from './typings';
export * from './typings';
export declare class MtLinkSdk {
    storedOptions: StoredOptions;
    init(clientId: string, options?: InitOptions): void;
    setSamlSubjectId(value: string): void;
    authorize(options?: AuthorizeOptions): void;
    onboard(options?: OnboardOptions): void;
    logout(options?: LogoutOptions): void;
    openService(serviceId: ServiceId, options?: OpenServicesConfigsOptions): void;
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
