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
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'table-vendor': ['@tanstack/react-table'],
          'chart-vendor': ['recharts'],
          'utils-vendor': ['axios', 'date-fns', 'clsx', 'tailwind-merge'],
          'icons-vendor': ['lucide-react'],
          'toast-vendor': ['sonner'],
          'state-vendor': ['zustand'],
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
