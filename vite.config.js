/**
 * @type {import('vite').UserConfig}
 */

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'  // 代码提示
import path from 'path';

export default defineConfig({
  alias:{
    '@':path.resolve(__dirname,'src'),
    'common':path.resolve(__dirname,'src/common'),
    'comps':path.resolve(__dirname,'src/components'),
    'views':path.resolve(__dirname,'src/views'),
  }, // 别名
  server: {
    open: true,
  },
  plugins: [vue(), vueJsx()]
})
