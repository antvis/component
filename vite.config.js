// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './__tests__/integration/',
  plugins: [react()],
  server: {
    port: 8080,
    open: '/',
  },
});
