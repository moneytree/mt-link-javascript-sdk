import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { TextEncoder } from 'util';
import { webcrypto } from 'node:crypto';

fetchMock.enableMocks();

// JSDOM doesn't implement these, but browsers do
// [TextEncoder] https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
// [SubtleCrypto] https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
// So we polyfill from Node's WHATWG-complient utils
// [TextEncoder] https://nodejs.org/api/util.html#class-utiltextencoder
// [SubtleCrypto] https://nodejs.org/api/webcrypto.html
Object.assign(global, { TextEncoder });
Object.defineProperty(global, 'crypto', {
  value: webcrypto,
  configurable: true,
  writable: true
});
