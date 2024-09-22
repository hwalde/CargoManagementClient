// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import webSocketService from './services/websocketService';

const app = createApp(App);

app.use(router);

app.mount('#app');

window.addEventListener('beforeunload', () => {
    webSocketService.disconnect();
});
