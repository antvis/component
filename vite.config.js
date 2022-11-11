import { defineConfig } from 'vite';
const path = require('path');

export default defineConfig({
  root: './__tests__/integration/',
  server: {
    port: 8080,
    open: '/',
  },
});
