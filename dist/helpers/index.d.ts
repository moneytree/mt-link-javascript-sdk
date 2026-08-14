import { Scopes, InitOptions, ConfigsOptions, StoredOptions } from '../typings';
import type { QueryData } from '../api/open-service/open-service-url';
export declare function constructScopes(scopes?: Scopes): string | undefined;
export declare function getIsTabValue(isNewTab?: boolean): '' | '_self';
export declare function hasWindow(): boolean;
export declare function mergeConfigs(initValues: InitOptions, newValues: ConfigsOptions, ignoreKeys?: string[]): StoredOptions & ConfigsOptions;
export declare function generateConfigs(configs?: StoredOptions & ConfigsOptions): Promise<string>;
export declare function generateCodeChallenge(): Promise<string>;
export declare function generateSdkHeaderInfo(): {
    'mt-sdk-platform': string;
    'mt-sdk-version': string;
};
export declare function openWindow(url: string, windowName: string): Window | null;
export declare function objectToQueryString(paramsObject: Record<string, unknown> | QueryData): string;
export declare function queryStringToObject(queryString: string): Record<string, string>;
