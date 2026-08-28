import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // The production site is served from the root of the custom domain.
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
  },
})
