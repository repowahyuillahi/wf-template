import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base disesuaikan untuk GitHub Pages project site:
// https://repowahyuillahi.github.io/wf-template/
export default defineConfig({
  plugins: [react()],
  base: '/wf-template/',
})
