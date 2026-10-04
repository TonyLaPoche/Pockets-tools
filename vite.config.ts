import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Pockets-tools/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        id: '/Pockets-tools/',
        name: 'Pocket Tools',
        short_name: 'Pocket',
        description: 'Index des mini-apps d’Antoine Terrade.',
        lang: 'fr',
        dir: 'ltr',
        start_url: '/Pockets-tools/',
        scope: '/Pockets-tools/',
        display: 'standalone',
        background_color: '#110f0d',
        theme_color: '#110f0d',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
})
