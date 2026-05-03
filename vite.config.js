import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // server: {https: true},
  server: {
    host: '0.0.0.0',
    port: 5004
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: [''],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'charts': ['@mui/x-charts', 'chart.js', 'react-chartjs-2'],
          'maps': ['react-leaflet', 'leaflet', 'leaflet-geosearch'],
          'blockchain': ['wagmi', 'viem', '@rainbow-me/rainbowkit', '@tanstack/react-query'],
          'utils': ['axios', 'date-fns', 'dayjs', 'react-hot-toast'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@style': path.resolve(__dirname, 'src/style'),
      '@API':path.resolve(__dirname, 'src/App.jsx'),
      '@context':path.resolve(__dirname, 'src/context')
    }
  }
})
