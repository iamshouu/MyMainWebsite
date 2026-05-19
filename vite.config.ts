import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // CRITICAL FIX: Explicitly look for VITE_API_KEY first (as seen in your screenshot), then API_KEY
  const apiKey = env.VITE_API_KEY || env.API_KEY || '';

  return {
    // base "/" и в dev, и в prod — теперь сайт раздаётся с кастомного
    // домена shouuu.ru, где он лежит в корне (а не в подпути /Website/
    // как было на iamshouu.github.io/Website/).
    //
    // public/CNAME с содержимым "shouuu.ru" подсказывает GitHub Pages
    // привязать сайт к кастомному домену. Пути к ассетам в TS-коде
    // через import.meta.env.BASE_URL подстраиваются автоматически.
    base: '/',
    plugins: [react()],
    define: {
      // We inject the found key into the app so it's accessible via process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
    server: {
      port: 5173,
      // Если порт занят, Vite возьмёт следующий (5174, …) — смотри URL в терминале, не закрепляйся на 5173.
      strictPort: false,
    },
  }
})