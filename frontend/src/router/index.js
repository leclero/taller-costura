import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { 
    path: '/admin', 
    name: 'admin', 
    component: AdminView,
    meta: { requiresAuth: true } // Bloqueo de seguridad
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// GUARDIA DE SEGURIDAD
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLogged') === 'true';

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Redirige al login si intenta entrar al admin
  } else if (to.path === '/login' && isAuthenticated) {
    next('/admin'); // Si ya está logueado y va al login, mándalo al admin
  } else {
    next();
  }
})

export default router