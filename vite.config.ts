/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Aumentar el límite de advertencia de chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Configuración manual de chunks para optimizar el bundle
        manualChunks: {
          // Vendors principales
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'radix-vendor': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip'
          ],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'table-vendor': ['@tanstack/react-table'],
          'utils-vendor': ['axios', 'date-fns', 'clsx', 'tailwind-merge', 'jwt-decode'],
          'icons-vendor': ['lucide-react'],
          'toast-vendor': ['sonner'],
          'state-vendor': ['zustand'],
          'ui-libs': ['class-variance-authority', 'cmdk', 'react-day-picker', 'react-phone-number-input'],
          'external-apis': ['@mercadopago/sdk-js', '@react-google-maps/api', 'socket.io-client'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
