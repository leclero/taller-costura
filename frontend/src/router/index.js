// === SECCIÓN 1: IMPORTACIONES DE VUE ROUTER Y VISTAS ===
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'   // La cara pública del taller
import AdminView from '../views/AdminView.vue' // El panel de control (Privado)
import LoginView from '../views/LoginView.vue' // El formulario de acceso

// === SECCIÓN 2: DEFINICIÓN DE RUTAS ===
const routes = [
  // Ruta Principal: Accesible para todo el mundo
  { path: '/', name: 'home', component: HomeView },
  
  // Ruta de Login: Donde se validan las credenciales
  { path: '/login', name: 'login', component: LoginView },
  
  // Ruta Protegida: Usamos 'meta' para marcar que esta ruta no es libre
  { 
    path: '/admin', 
    name: 'admin', 
    component: AdminView, 
    meta: { requiresAuth: true } // Esta es nuestra "bandera" de seguridad
  }
]

// === SECCIÓN 3: CONFIGURACIÓN DEL MOTOR DE RUTAS ===
const router = createRouter({
  // WebHistory elimina el '#' de las URLs para que queden profesionales
  history: createWebHistory(),
  routes
})

// === SECCIÓN 4: GUARDIA DE SEGURIDAD (Navigation Guard) ===
/**
 * Este bloque de código es el corazón de la seguridad en el Frontend.
 * Se dispara antes de cargar cualquier componente.
 */
router.beforeEach((to, from, next) => {
  // Leemos el LocalStorage (que configuramos en LoginView.vue)
  const isAuthenticated = localStorage.getItem('isLogged') === 'true';

  // LÓGICA DE PROTECCIÓN:
  
  // 1. Si la ruta pide autenticación Y el usuario NO está logueado:
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Bloqueamos el paso y redirigimos al Login
  } 
  
  // 2. Si el usuario YA está logueado e intenta entrar al Login de nuevo:
  else if (to.path === '/login' && isAuthenticated) {
    next('/admin'); // Lo mandamos al panel, no necesita loguearse otra vez
  } 
  
  // 3. En cualquier otro caso (ir a Home o si tiene permiso):
  else {
    next(); // "Pase libre", se renderiza la vista solicitada
  }
})

export default router