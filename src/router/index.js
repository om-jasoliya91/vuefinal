import LoginVue from '@/pages/LoginVue.vue'
import RegisterView from '@/pages/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/', name: 'register', component: RegisterView },
  { path: '/login', name: 'login', component: LoginVue },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
