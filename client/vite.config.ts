import { join } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Icons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Unocss from 'unocss/vite'
// https://vitejs.dev/config/
export default defineConfig({
  base: '/__debugger__/',
  resolve: {
    alias: {
      '~/': __dirname,
    },
  },
  plugins: [
    vue(),
    Pages({
      pagesDir: 'pages',
    }),
    Icons(),
    Components({
      dirs: [
        'components',
      ],
      dts: join(__dirname, 'components.d.ts'),
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),
    Unocss(),
    AutoImport({
      dts: join(__dirname, 'auto-imports.d.ts'),
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
      ],
    }),
  ],
})
