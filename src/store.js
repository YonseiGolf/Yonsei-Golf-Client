import {createStore} from 'vuex';
import axios from "axios";
import Swal from "sweetalert2";

const store = createStore({
    state: {
        userId: 0,
        username: '',
        adminStatus: false,
        memberStatus: false,
        isLoggedIn: false
    },
    mutations: {
        SET_USER_DETAILS(state, payload) {
            state.userId = payload.userId || '';
            state.username = payload.username || '';
            state.adminStatus = payload.adminStatus || false;
            state.memberStatus = payload.memberStatus || false;
            state.isLoggedIn = !!payload.username;

            // 세션 스토리지에 정보 저장
            sessionStorage.setItem('id', state.userId);
            sessionStorage.setItem('username', state.username);
            sessionStorage.setItem('adminStatus', state.adminStatus.toString());
            sessionStorage.setItem('memberStatus', state.memberStatus.toString());
            sessionStorage.setItem('isLoggedIn', state.isLoggedIn.toString());
        },

        RESTORE_SESSION(state) {
            state.userId = sessionStorage.getItem('id') || '';
            state.username = sessionStorage.getItem('username') || '';
            state.adminStatus = (sessionStorage.getItem('adminStatus') === 'true');
            state.isLoggedIn = (sessionStorage.getItem('isLoggedIn') === 'true');
            state.memberStatus = (sessionStorage.getItem('memberStatus') === 'true');
        },
        SET_LOGOUT(state) {
            state.userId = '';
            state.username = '';
            state.adminStatus = false;
            state.isLoggedIn = false;
            state.memberStatus = false;

            // 세션 스토리지 정보 초기화
            sessionStorage.removeItem('id');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('adminStatus');
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('memberStatus');
        }
    },
    actions: {
        restoreSession({commit}) {
            commit('RESTORE_SESSION');
        },
        async logout({commit}) {
            try {
                // 로그아웃 API 요청
                await axios.post(`${process.env.VUE_APP_API_URL}/users/logout`, {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });

                // 로그아웃 성공 시 Vuex 상태 초기화
                commit('SET_LOGOUT');
                console.log("로그아웃 성공");
                console.log(localStorage.getItem('accessToken'));
                localStorage.removeItem('accessToken');
                console.log(localStorage.getItem('accessToken'));

                Swal.fire("로그아웃 되었습니다.");
            } catch (error) {
                console.error("Logout failed:", error);
            }
        }
    }

});

export default store;
