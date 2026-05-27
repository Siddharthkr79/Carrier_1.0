import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  // Map REACT_APP_ env vars to import.meta.env.VITE_ format
  define: {
    'process.env.REACT_APP_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8080/api'),
    'process.env.REACT_APP_RAZORPAY_KEY_ID': JSON.stringify(process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_key'),
  },
});
