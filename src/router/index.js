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
import FormManagement from "@/components/application/admin/FormManagement.vue";
import UserManagement from "@/components/user/admin/UserManagement.vue";
import ApplicationDetail from "@/components/application/admin/ApplicationDetail.vue";
import BoardHome from "@/components/board/BoardHome.vue";
import PostBoard from "@/components/board/PostBoard.vue";
import BoardDetail from "@/components/board/BoardDetail.vue";
import ApplyAlarm from "@/components/application/admin/ApplyAlarm.vue";
import AdminPage from "@/components/admin/AdminPage.vue";
import Swal from "sweetalert2";
import BoardTemplateHome from "@/components/board/admin/BoardTemplateHome.vue";
import BoardTemplateDetail from "@/components/board/admin/BoardTemplateDetail.vue";
import ApplyPeriodAdmin from "@/components/applyinfo/admin/ApplyPeriodAdmin.vue";

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
        path: '/board',
        name: '/board',
        component: BoardHome
    },
    {
        path: '/board/post',
        name: 'posting board',
        component: PostBoard,
        beforeEnter: (to, from, next) => {
            if (store.state.isLoggedIn) {
                next();
            } else {
                next('/');
            }
        }
    },
    {
        path: '/board/:boardId',
        name: 'BoardDetail',
        component: BoardDetail
    },

    {
        path: '/admin',
        name: 'admin',
        component: AdminPage,
        redirect: '/admin/users',
        children: [
            {
                path: '/admin/apply/form',
                name: 'applicationForm',
                component: ApplicationForm
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
                path: '/application/:id',
                name: 'ApplicationDetail',
                component: ApplicationDetail
            },
            {
                path: '/admin/users',
                name: 'userManagement',
                component: UserManagement,
                beforeEnter: async (to, from, next) => {
                    if (store.state.adminStatus) {
                        next();
                    } else {
                        next('/');
                    }
                }
            },
            {
                path: '/admin/apply-alarm',
                name: 'applyAlarm',
                component: ApplyAlarm
            },
            {
                path: '/admin/board/template',
                name: 'boardTemplate',
                component: BoardTemplateHome
            },
            {
                path: '/admin/board/template/:boardId',
                name: 'boardTemplateDetail',
                component: BoardTemplateDetail
            },
            {
                path: '/admin/apply-period',
                name: 'applyPeriod',
                component: ApplyPeriodAdmin
            }
        ]
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
        next('/');
    } else {
        next();
    }
});

router.beforeEach((to, from, next) => {
    // 'admin' 경로 또는 하위 경로에 접근하려고 할 때 확인
    if (to.matched.some(record => record.path.startsWith('/admin'))) {
        // 관리자 상태를 확인하는 로직
        if (!store.state.adminStatus) {
            // 관리자 상태가 아니면 SweetAlert 경고 표시 후 메인 페이지로 리디렉션
            Swal.fire({
                icon: 'error',
                title: '권한이 없습니다',
                text: '이 페이지에 접근하려면 관리자 권한이 필요합니다.',
                confirmButtonColor: '#0a3d91',
            }).then(() => {
                next('/');
            });
        } else {
            // 관리자 상태가 맞다면 다음 라우트로 진행
            next();
        }
    } else {
        // 'admin' 경로가 아닌 경우는 다음 라우트로 바로 진행
        next();
    }
});

export default router
