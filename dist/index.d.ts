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
interface LinkOptions {
    backTo?: string;
    newTab?: boolean;
}
declare class LinkSDK {
    private domains;
    private params;
    init(config: Config): void;
    authorize({ newTab }?: {
        newTab?: boolean | undefined;
    }): void;
    openVault(options?: LinkOptions): void;
    openSettings(options?: LinkOptions): void;
}
declare const _default: LinkSDK;
export default _default;
