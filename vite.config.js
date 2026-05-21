import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mockApiPlugin } from './mockApiPlugin.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockApiPlugin()],
});
