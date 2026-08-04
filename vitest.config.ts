import { defineConfig } from 'vitest/config';
import packageJSON from './package.json';

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(packageJSON.version)
  },
  test: {
    globals: true,
    environment: 'jsdom',
    clearMocks: true,
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    setupFiles: ['./scripts/testSetup.ts']
  }
});
