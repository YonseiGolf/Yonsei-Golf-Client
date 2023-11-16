import {createStore} from 'vuex';
import axios from "axios";

const store = createStore({
    state: {
        userId: 0,
        username: '',
        adminStatus: false,
        isLoggedIn: false
    },
    mutations: {
        SET_USER_DETAILS(state, payload) {
            state.userId = payload.userId || '';
            state.username = payload.username || '';
            state.adminStatus = payload.adminStatus || false;
            state.isLoggedIn = !!payload.username;

            // 세션 스토리지에 정보 저장
            sessionStorage.setItem('id', state.userId);
            sessionStorage.setItem('username', state.username);
            sessionStorage.setItem('adminStatus', state.adminStatus.toString());
            sessionStorage.setItem('isLoggedIn', state.isLoggedIn.toString());

            console.log("userId:" , state.userId, "username:", state.username, "adminStatus:", state.adminStatus, "isLoggedIn:", state.isLoggedIn)
        },
        RESTORE_SESSION(state) {
            state.userId = sessionStorage.getItem('id') || '';
            state.username = sessionStorage.getItem('username') || '';
            state.adminStatus = (sessionStorage.getItem('adminStatus') === 'true');
            state.isLoggedIn = (sessionStorage.getItem('isLoggedIn') === 'true');
        },
        SET_LOGOUT(state) {
            state.userId = '';
            state.username = '';
            state.adminStatus = false;
            state.isLoggedIn = false;

            // 세션 스토리지 정보 초기화
            sessionStorage.removeItem('id');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('adminStatus');
            sessionStorage.removeItem('isLoggedIn');
        }
    },
    actions: {
        restoreSession({commit}) {
            commit('RESTORE_SESSION');
        },
        async logout({commit}) {
            try {
                // 로그아웃 API 요청
                await axios.post(`${process.env.VUE_APP_API_URL}/users/logout`);

                // 로그아웃 성공 시 Vuex 상태 초기화
                commit('SET_LOGOUT');
                alert("로그아웃 되었습니다.")
            } catch (error) {
                console.error("Logout failed:", error);
            }
        }
    }

});

export default store;
