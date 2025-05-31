import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api requests to our backend server
      '/api': {
        target: 'http://localhost:5001', // Your backend server address
        changeOrigin: true, // Needed for virtual hosted sites
        // secure: false, // Uncomment if your backend is not HTTPS and you encounter issues
        // rewrite: (path) => path.replace(/^\/api/, '') // If your backend doesn't expect /api prefix
      },
    },
  },
})
