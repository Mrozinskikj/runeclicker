// electron.vite.config.js
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/main/index.ts')
      }
    },
    plugins: [externalizeDepsPlugin()],
  },

  preload: {
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/preload/index.ts')
      }
    },
    plugins: [externalizeDepsPlugin()],
  },

  renderer: {
    root: '.',

    build: {
      outDir: 'dist/renderer',
      rollupOptions: {
        input: resolve(__dirname, 'index.html')
      }
    },
    base: './',
    plugins: [react()],
    define: {
      __IS_ELECTRON__: true,
    },
  }
})