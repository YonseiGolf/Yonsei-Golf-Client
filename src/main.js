import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '../axiosConfig';
import store from './store';
import './assets/global.css';
import Vue3Toast from 'vue3-toastify'


const app = createApp(App);
app.use(router);
app.use(store);
app.use(Vue3Toast);
app.mount('#app');
