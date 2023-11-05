import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import {loadFonts} from './plugins/webfontloader'
import store from "@/store";
import axios from 'axios'; // Axios를 임포트합니다.

axios.defaults.withCredentials = true;

loadFonts()

createApp(App)
    .use(router)
    .use(vuetify)
    .use(store)
    .mount('#app')
