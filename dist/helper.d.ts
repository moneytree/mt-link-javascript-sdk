import { Scopes, InitOptions, ConfigsOptions } from './typings';
export declare function constructScopes(scopes?: Scopes): string | undefined;
export declare function getIsTabValue(isNewTab?: boolean): '' | '_self';
export declare function mergeConfigs(initValues: InitOptions, newValues: ConfigsOptions, ignoreKeys?: string[]): ConfigsOptions;
export declare function generateConfigs(configs?: ConfigsOptions): string;
export declare function generateCodeChallenge(): string;
export declare function generateSdkHeaderInfo(): {
    'mt-sdk-platform': string;
    'mt-sdk-version': string;
};
export declare function openWindow(url: string, windowName: string): Window | null;
