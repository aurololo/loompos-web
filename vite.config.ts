import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// LoomPOS PWA — works on Vercel out of the box (root → web/) and on
// GitHub Pages by setting VITE_BASE_PATH to "/<repo>/" at build time.
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'icon-192.png', 'icon-512.png', 'icon-maskable.png', 'icon.svg', 'icon-maskable.svg', 'favicon.svg'],
      manifest: {
        name: 'LoomPOS — Restaurant Operating System',
        short_name: 'LoomPOS',
        description: 'A premium restaurant POS ecosystem. Weaving operations together.',
        theme_color: '#0F0F10',
        background_color: '#0F0F10',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icon-192.png',      sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png',      sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
          { src: 'icon.svg',          sizes: 'any',     type: 'image/svg+xml' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        navigateFallback: '/index.html'
      }
    })
  ],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 }
});
