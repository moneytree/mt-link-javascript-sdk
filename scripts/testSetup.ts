import { TextEncoder } from 'node:util';
import { webcrypto } from 'node:crypto';
import { fetchMock } from '../src/test-utils/mockFetch';

global.fetch = fetchMock;

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
