import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [basicSsl()],

  server: {
    // So it can run without conflicting with Vault
    port: 9001
  },

  // So it can bundle CJS -> ESM through the portal
  optimizeDeps: {
    include: ['@moneytree/mt-link-javascript-sdk']
  }
});
