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
    'components':path.resolve(__dirname,'src/components'),
    'views':path.resolve(__dirname,'src/views'),
    'plugins':path.resolve(__dirname,'src/plugins'),
  }, // 别名
  server: {
    open: true,
  },
  plugins: [vue(), vueJsx()]
})
