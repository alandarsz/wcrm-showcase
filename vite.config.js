import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [
      vue(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: env.VITE_APP_NAME,
          }
        }
      }),
      Components({
        dirs: ["src/components/**"],
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
      }),
    ],
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    server: {
      port: env.VITE_SERVER_PORT,
      host:true
    },
    preview: {
      port: env.VITE_PREVIEW_PORT,
    },
    resolve: {
      alias: {
        '~/': `${resolve(__dirname, 'src')}/`,
        '@': resolve(__dirname, 'src'),
      },
      // why remove it , look for https://github.com/vitejs/vite/issues/6026
      // extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs']
    },
    css: {
      preprocessorOptions: {
        //define global scss variable
        scss: {
          additionalData: `@use "@/styles/index.scss" as *;`,
          // additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },
  })
};