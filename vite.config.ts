import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const projectRoot = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:9090' },
      '/oauth2': { target: 'http://localhost:9090' },
      '/login': { target: 'http://localhost:9090' },
      '/logout': { target: 'http://localhost:9090' },
    },
  },
})
