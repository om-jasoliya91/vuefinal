import AddUser from '@/pages/dashboard/AddUser.vue'
import HomeView from '@/pages/dashboard/HomeView.vue'
import LoginVue from '@/pages/LoginVue.vue'
import RegisterView from '@/pages/RegisterView.vue'
import EditUser from '@/pages/dashboard/EditUser.vue'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/', name: 'register', component: RegisterView },
  { path: '/login', name: 'login', component: LoginVue },
  { path: '/home', name: 'home', component: HomeView, meta: { requireAuth: true } },
  { path: '/adduser', name: 'adduser', component: AddUser, meta: { requireAuth: true } },
  {
    path: '/edituser/:id',
    name: 'EditUser',
    component: EditUser,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, form, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requireAuth && !token) {
    return next('/login')
  }
  next()
})
export default router
