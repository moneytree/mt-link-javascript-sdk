import { vi } from 'vitest';
import { TextEncoder } from 'node:util';
import { webcrypto } from 'node:crypto';

// jest-fetch-mock reaches for the global `jest.fn` at import time, so we
// stand in a minimal shim before pulling it in under Vitest.
Object.assign(global, { jest: { fn: vi.fn } });
const fetchMock = (await import('jest-fetch-mock')).default;

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
