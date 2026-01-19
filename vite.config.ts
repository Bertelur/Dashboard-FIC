import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'mask-icon.svg'
      ],
      manifest: {
        name: 'FIC Dashboard',
        short_name: 'FIC Dashboard',
        description: 'FIC Dashboard for managing business operations.',
        theme_color: '#f69435',
        background_color: '#f69435',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  }
})
