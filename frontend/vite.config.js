import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // Set to repository name if deploying to /repository-name/
  // Set to '/' if deploying to root or custom domain
  base: process.env.NODE_ENV === 'production' ? '/Humanitarian-Intelligence-Platform-Nigeria/' : '/',
  server: {
    port: 3000
    // No proxy needed - all API calls are now client-side
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Ensure proper chunking for GitHub Pages
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts-vendor': ['recharts'],
          'leaflet-vendor': ['leaflet', 'react-leaflet']
        }
      }
    }
  }
})
