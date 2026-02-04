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
    meta: { requiresAuth: true } // Bloqueo de seguridad activado
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// GUARDIA DE SEGURIDAD ACTIVADA
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLogged') === 'true';

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Redirige al login si intenta entrar al admin sin permiso
  } else if (to.path === '/login' && isAuthenticated) {
    next('/admin'); // Si ya está logueado, mándalo al panel directamente
  } else {
    next();
  }
})

export default router