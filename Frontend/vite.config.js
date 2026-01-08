import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://intervyo.xyz',
      routes: [
        '/',
        '/login',
        '/signup',
        '/features',
        '/pricing',
        '/about',
        '/contact'
      ]
    })
  ]
})
