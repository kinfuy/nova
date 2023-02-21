import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useWebSocket } from './hooks/useWebSocket';
import router from './router';

import '@unocss/reset/tailwind.css';
import './styles/index.css';
import 'uno.css';

import App from './App.vue';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(router);

app.use(pinia);

useWebSocket();

app.mount('#app');
