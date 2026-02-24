import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'

// Suppress noisy face-api.js sourcemap warnings (the npm package omits original .ts source files)
const logger = createLogger()
const loggerWarn = logger.warn
logger.warn = (msg, options) => {
  if (msg.includes('face-api.js') && msg.includes('points to missing source files')) return
  loggerWarn(msg, options)
}

export default defineConfig({
  customLogger: logger,
  plugins: [
    react(),
    // sitemap({
    //   hostname: 'https://intervyo.xyz',
    //   routes: [
    //     '/',
    //     '/login',
    //     '/signup',
    //     '/features',
    //     '/pricing',
    //     '/about',
    //     '/contact'
    //   ]
    // })
  ],
  resolve: {
    alias: {
      fs: false,
      path: false,
    }
  },
  optimizeDeps: {
    exclude: ['face-api.js']
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress sourcemap warnings from face-api.js (missing source files in the npm package)
        if (warning.code === 'SOURCEMAP_ERROR' ||
          (warning.message && warning.message.includes('face-api.js'))) {
          return
        }
        warn(warning)
      }
    }
  }
})
