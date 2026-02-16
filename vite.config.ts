
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the Gemini API to find the key without crashing the bundle
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  }
});
