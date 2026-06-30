import { Scopes, InitOptions, ConfigsOptions, StoredOptions } from './typings';
export declare function constructScopes(scopes?: Scopes): string | undefined;
export declare function getIsTabValue(isNewTab?: boolean): '' | '_self';
export declare function mergeConfigs(initValues: InitOptions, newValues: ConfigsOptions, ignoreKeys?: string[]): StoredOptions & ConfigsOptions;
export declare function generateConfigs(configs?: StoredOptions & ConfigsOptions): Promise<string>;
export declare function generateCodeChallenge(): string;
export declare function generateSdkHeaderInfo(): {
    'mt-sdk-platform': string;
    'mt-sdk-version': string;
};
export declare function openWindow(url: string, windowName: string): Window | null;
