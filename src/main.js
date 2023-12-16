import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import '../axiosConfig';
import store from './store';
import './assets/global.css';
import Vue3Toast from 'vue3-toastify'
import axios from "axios";

async function initializeApp() {

    try {
        // Refresh Token이 있는지 확인하고, 서버에 Access Token 재발급 요청
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/users/signIn/refresh`);
        if (response.status === 200) {
            const token = response.data.data.accessToken;

            // Session Storage에 Access Token 저장
            sessionStorage.setItem('accessToken', token);

            // 로그인 성공 후 다시 Authorization access Token 설정
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const parts = token.split('.');
            const payload = parts[1]
            const decoded = atob(payload);
            const decodedURIComponent = decodeURIComponent(escape(decoded));
            const json = JSON.parse(decodedURIComponent);

            // 로그인이 성공하면 store 에 로그인 정보를 저장해둔다.
            const userDetails = {
                userId: json.userProfile.id,
                username: json.userProfile.name,
                adminStatus: json.userProfile.adminStatus,
                memberStatus: json.userProfile.memberStatus,
            };
            store.commit('SET_USER_DETAILS', userDetails);

        }
    } catch (error) {
        console.error('자동 로그인 실패:', error);
        // 로그인 페이지로 리디렉트 등의 처리...
    }

}


initializeApp().then(() => {
    // createApp(App).mount('#app');
    const app = createApp(App);
    app.use(router);
    app.use(store);
    app.use(Vue3Toast);
    app.mount('#app');
});