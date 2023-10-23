import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../axiosConfig'

createApp(App).use(router).mount('#app')
