import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '../axiosConfig';
import store from './store';
import './assets/global.css';

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
