import { createStore } from 'vuex';

const store = createStore({
    state: {
        username: '',
        adminStatus: false,
        isLoggedIn: false
    },
    mutations: {
        SET_USER_DETAILS(state, payload) {
            state.username = payload.username || '';
            state.adminStatus = payload.adminStatus || false;
            state.isLoggedIn = !!payload.username;

            // 세션 스토리지에 정보 저장
            sessionStorage.setItem('username', state.username);
            sessionStorage.setItem('adminStatus', state.adminStatus.toString());
            sessionStorage.setItem('isLoggedIn', state.isLoggedIn.toString());

            console.log("username:", state.username, "adminStatus:", state.adminStatus, "isLoggedIn:", state.isLoggedIn)
        },
        RESTORE_SESSION(state) {
            state.username = sessionStorage.getItem('username') || '';
            state.adminStatus = (sessionStorage.getItem('adminStatus') === 'true');
            state.isLoggedIn = (sessionStorage.getItem('isLoggedIn') === 'true');
        }
    },
    actions: {
        restoreSession({ commit }) {
            commit('RESTORE_SESSION');
        }
    }
});

export default store;
