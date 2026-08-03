import { defineConfig } from 'vite';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import packageJSON from './package.json';

export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ['process', 'buffer', 'stream']
    })
  ],
  define: {
    __VERSION__: JSON.stringify(packageJSON.version)
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['cjs'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      output: {
        // Match the old webpack commonjs2 output shape: module.exports carries
        // both the default export (under `.default`) and all named exports.
        exports: 'named'
      }
    }
  }
});
