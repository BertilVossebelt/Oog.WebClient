import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignUpView from "@/views/SignUpView.vue";
import LoginView from "@/views/LoginView.vue";
import EnvironmentSelectorView from "@/views/EnvironmentSelectorView.vue";
import DashboardView from "@/views/DashboardView.vue";
import PeopleManagementView from "@/views/PeopleManagementView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/environment-selector',
      name: 'environment-selector',
      component: EnvironmentSelectorView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/people-management',
      name: 'people-management',
      component: PeopleManagementView,
    },
  ],
})

export default router
