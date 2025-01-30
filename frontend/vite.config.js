import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  exclude: [
        '@ionic/core/loader' //fix weird Vite error "outdated optimize dep"
    ],
  extras: {
    enableImportInjection: true
  },
  optimizeDeps: {
    exclude: ['myStencilLib/loader']
  },
})
