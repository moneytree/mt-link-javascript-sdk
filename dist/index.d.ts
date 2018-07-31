interface Config {
    clientId: string;
    isTestEnvironment?: boolean;
    scope: string[];
    redirectUri?: string;
    responseType?: string;
    appToken?: string;
    locale?: string;
    state?: string;
}
declare class LinkSDK {
    private domains;
    private params;
    init(config: Config): void;
    setToken(appToken: string): void;
    authorize(newTab?: boolean): void;
    openVault(newTab?: boolean): void;
    openSettings(newTab?: boolean): void;
}
declare const _default: LinkSDK;
export default _default;
