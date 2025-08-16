/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// Lê teus arquivos cert/key (mesmos do backend se quiser)
//const cert = fs.readFileSync('./cert/cert.pem')
const key = fs.readFileSync('./cert/key.pem')

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key,
      cert
    },
    port: 3001,
    proxy: {
      // Se quiser, pode proxyar as chamadas para o backend
      '/api': 'https://localhost:3000'
    }
  }
})*/
