import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import debug from '../dist/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), debug()],
})
