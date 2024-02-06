import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/_colors.scss";`,
      },
    },
  },
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: 'Crack the Code ',
        short_name: 'CodeCrack',
        description:
          'Challenge your mind with this engaging 4-digit code guessing game.',
        theme_color: '#3c4040',
        icons: [
          {
            src: 'lock.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
