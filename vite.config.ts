import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { chunkSizeWarningLimit: 600 },
  server: {
    proxy: { '/api': 'http://localhost:8787' },
    // la base SQLite vive en data/; si Vite la vigila, recarga la página en cada escritura
    watch: { ignored: ['**/data/**', '**/server/**'] },
  },
})
