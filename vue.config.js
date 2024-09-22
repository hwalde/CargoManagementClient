// vue.config.js
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000, // Legen Sie den Port für die Vue-Anwendung fest (z.B. 3000)
    proxy: {
      '/api': { // Proxy für REST-API-Anfragen
        target: 'http://localhost:8080', // URL Ihres Java REST Backends
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, // Entfernt das /api Präfix
        secure: false, // Falls Ihr Backend HTTPS verwendet
      },
      '/ws': { // Proxy für WebSocket-Verbindungen
        target: 'http://localhost:8080', // URL Ihres WebSocket-Endpunkts
        ws: true,
        changeOrigin: true,
        secure: false, // Falls Ihr Backend HTTPS verwendet
      },
    },
  },
});
