import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/components/home/HomePage.vue";
import ApplyInfo from "@/components/applyinfo/ApplyInfo.vue";
import ApplicationPage from "@/components/application/ApplicationPage.vue";
import ApplicationForm from "@/components/application/ApplicationForm.vue";

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
