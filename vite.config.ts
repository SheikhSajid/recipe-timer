import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/recipe-timer/', // This should match your GitHub repository name
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
