import {createRouter, createWebHistory} from 'vue-router'
import HomePage from "@/components/home/HomePage.vue";
import ApplyInfo from "@/components/applyinfo/ApplyInfo.vue";
import ApplicationPage from "@/components/application/ApplicationPage.vue";
import ApplicationForm from "@/components/application/ApplicationForm.vue";
import LoginPage from "@/components/user/LoginPage.vue";
import SignUpPage from "@/components/user/SignUpPage.vue";
import globalState from "@/globalState";
import CallBack from "@/components/user/CallBack.vue";
import store from "@/store";
import FormManagement from "@/components/admin/FormManagement.vue";
import UserManagement from "@/components/user/admin/UserManagement.vue";
import ApplicationDetail from "@/components/admin/ApplicationDetail.vue";
import BoardHom from "@/components/board/BoardHom.vue";
import PostBoard from "@/components/board/PostBoard.vue";
import BoardDetail from "@/components/board/BoardDetail.vue";
import AdminMain from "@/components/admin/AdminMain.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomePage
    },
    {
        path: '/recruit',
        name: 'recruitment',
        component: ApplyInfo
    },
    {
        path: '/apply',
        name: 'applyInfo',
        component: ApplicationPage
    },
    {
        path: '/apply/form',
        name: 'applicationForm',
        component: ApplicationForm
    },
    {
        path: '/login',
        name: 'loginPage',
        component: LoginPage
    },
    {
        path: '/signup',
        name: 'signupPage',
        component: SignUpPage,
        beforeEnter: (to, from, next) => {
            if (globalState.loginFailed) {
                globalState.loginFailed = false;  // 상태를 다시 초기화
                next();
            } else {
                next('/');
            }
        }
    },
    {
        path: '/oauth/kakao',
        name: 'kakaoLogin',
        component: CallBack
    },
    {
        path: '/admin/form',
        name: 'formManagement',
        component: FormManagement,
        beforeEnter: (to, from, next) => {
            if (store.state.adminStatus) {
                next();
            } else {
                next('/');
            }
        }
    },
    {
        path: '/admin/users',
        name: 'userManagement',
        component: UserManagement,
        beforeEnter: (to, from, next) => {
            if (store.state.adminStatus) {
                next();
            } else {
                next('/');
            }
        }
    },
    {
        path: '/application/:id',
        name: 'ApplicationDetail',
        component: ApplicationDetail
    },
    {
        path: '/board',
        name: '/board',
        component: BoardHom
    },
    {
        path: '/board/post',
        name: 'posting board',
        component: PostBoard
    },
    {
        path: '/board/:boardId',
        name: 'board detail',
        component: BoardDetail
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminMain
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { left: 0, top: 0 }  // 모든 라우트 변경시 페이지의 최상단으로 스크롤
    }
})

router.beforeEach((to, from, next) => {
    if (to.name === 'loginPage' && store.state.isLoggedIn) {
        next('/');  // 이미 로그인된 상태에서 로그인 페이지 방문 시 홈으로 리디렉션
    } else {
        next();
    }
});

export default router
