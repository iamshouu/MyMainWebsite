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
    // Dev: base "/" — иначе Vite HMR WebSocket рвётся.
    // Production: base "/Website/" — GitHub Pages раздаёт сайт по пути
    //   https://iamshouu.github.io/Website/, и все ассеты должны
    //   резолвиться от этого префикса (/Website/assets/...).
    //   Если позже подключим кастомный домен (shouuu.ru) с сайтом на
    //   корне — поменяем обратно на "/" и добавим public/CNAME.
    base: command === 'build' ? '/Website/' : '/',
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