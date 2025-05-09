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
