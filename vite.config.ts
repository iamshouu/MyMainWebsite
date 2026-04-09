import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // CRITICAL FIX: Explicitly look for VITE_API_KEY first (as seen in your screenshot), then API_KEY
  const apiKey = env.VITE_API_KEY || env.API_KEY || '';

  return {
    base: './',
    plugins: [react()],
    define: {
      // We inject the found key into the app so it's accessible via process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})