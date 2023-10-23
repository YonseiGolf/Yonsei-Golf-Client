import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/components/home/HomePage.vue";
import ApplyInfo from "@/components/applyinfo/ApplyInfo.vue";
import ApplicationPage from "@/components/application/ApplicationPage.vue";
import ApplicationForm from "@/components/application/ApplicationForm.vue";
import LoginPage from "@/components/user/LoginPage.vue";
import SignUpPage from "@/components/user/SignUpPage.vue";
import globalState from "@/globalState";
import CallBack from "@/components/user/CallBack.vue";
import store from "@/store";

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
    path:'/login',
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'loginPage' && store.state.isLoggedIn) {
    next('/');  // 이미 로그인된 상태에서 로그인 페이지 방문 시 홈으로 리디렉션
  } else {
    next();
  }
});

export default router
