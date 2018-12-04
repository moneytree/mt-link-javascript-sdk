interface Config {
    clientId: string;
    isTestEnvironment?: boolean;
    scope: string[];
    redirectUri?: string;
    continueTo?: string;
    responseType?: string;
    locale?: string;
    state?: string;
}
interface VaultOptions {
    backTo?: string;
    newTab?: boolean;
}
interface MyaccountOptions {
    backTo?: string;
    newTab?: boolean;
    email?: string;
    authPage?: string;
}
declare class LinkSDK {
    private domains;
    private params;
    init(config: Config): void;
    authorize(options?: MyaccountOptions): void;
    openVault(options?: VaultOptions): void;
    openSettings(options?: MyaccountOptions): void;
}
declare const _default: LinkSDK;
export default _default;
