import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tailwindcss from '@tailwindcss/vite'

function copyDynamicEnv(): Plugin {
  return {
    name: 'copy-dynamic-env',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'dynamic-env.json',
        source: fs.readFileSync(path.resolve(import.meta.dirname, 'dynamic-env.json')),
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'https://localhost:44365'
  const authUrl = env.VITE_AUTH_URL || apiUrl
  const root = import.meta.dirname

  return {
    plugins: [react(), tailwindcss(), basicSsl(), copyDynamicEnv()],
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
      },
    },
    server: {
      host: 'localhost',
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': { target: apiUrl, changeOrigin: true, secure: false },
        '/connect': { target: authUrl, changeOrigin: true, secure: false },
        '/getEnvConfig': { target: apiUrl, changeOrigin: true, secure: false },
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(root, 'index.html'),
          silentRenew: path.resolve(root, 'silent-renew.html'),
        },
      },
    },
  }
})
