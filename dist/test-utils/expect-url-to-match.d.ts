export interface UrlExpectation {
    baseUrl: string;
    path: string;
    query?: Record<string, string>;
}
export default function expectUrlToMatchWithPKCE(actual: URL | string, expectation: UrlExpectation): void;
