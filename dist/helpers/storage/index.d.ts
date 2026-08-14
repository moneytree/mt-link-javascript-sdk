export declare const STORE_KEY = "mt-link-javascript-sdk";
export declare function get(key: string): string | undefined;
export declare function set(key: string, value: string): void;
export declare function del(key: string): void;
declare const _default: {
    set: typeof set;
    get: typeof get;
    del: typeof del;
};
export default _default;
