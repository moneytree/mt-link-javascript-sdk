import qs from 'qs';

export interface UrlExpectation {
  baseUrl: string;
  path: string;
  query?: Record<string, string>;
}

export default function expectUrlToMatchWithPKCE(actual: URL | string, expectation: UrlExpectation) {
  const url = typeof actual === 'string' ? new URL(actual) : actual;
  const actualQuery = qs.parse(new URLSearchParams(url.search).toString());

  expect(actualQuery.code_challenge).toBeDefined();
  delete actualQuery.code_challenge; // ignore PKCE code challenge because it's randomly generated
  expect(actualQuery.code_challenge_method).toBe('S256');
  delete actualQuery.code_challenge_method;

  expect(url.pathname).toBe(expectation.path);
  expect(`${url.protocol}//${url.hostname}`).toBe(expectation.baseUrl);
  expect(actualQuery).toEqual(expectation.query || {});
}
