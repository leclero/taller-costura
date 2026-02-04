<template>
  <div id="app">
    <nav class="navbar" :class="{ 'navbar-scrolled': scrolled || isAdminPage }">
      <div class="nav-container">
        <router-link to="/" class="nav-logo" @click="scrollTo('inicio')">
          <img src="/Smith.jpg" alt="Logo" class="logo-img" @error="e => e.target.style.display='none'">
          <span class="brand-name">Smith <span class="accent">Teilor</span></span>
        </router-link>

        <div class="nav-links">
          <template v-if="!isAdminPage">
            <a href="#inicio" class="nav-item" @click.prevent="scrollTo('inicio')">Inicio</a>
            <a href="#trabajos" class="nav-item" @click.prevent="scrollTo('trabajos')">Nuestro Trabajo</a>
            <a href="#reparaciones" class="nav-item" @click.prevent="scrollTo('reparaciones')">Arreglos</a>
            <a href="#tienda" class="nav-item" @click.prevent="scrollTo('tienda')">Tienda</a>
          </template>
          <template v-else>
            <router-link to="/" class="nav-item">⬅ Volver al Inicio</router-link>
          </template>
          
          <router-link to="/admin" class="btn-admin-nav">Panel Admin</router-link>
        </div>
      </div>
    </nav>

    <router-view />

    <footer class="main-footer">
      <div class="footer-line"></div>
      <p>&copy; 2026 <strong>Smith Teilor</strong> - Luján, Buenos Aires.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const scrolled = ref(false);

// Detecta si estamos en la ruta de administrador
const isAdminPage = computed(() => route.path === '/admin');

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

const scrollTo = (id) => {
  if (isAdminPage.value) return; // No hace scroll si no estamos en la home
  const element = document.getElementById(id);
  if (element) {
    const offset = 90;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style>
body { margin: 0; font-family: 'Inter', sans-serif; background-color: #ffffff; color: #333; }

.navbar { 
  position: fixed; top: 0; width: 100%; height: 85px; z-index: 10000; 
  display: flex; align-items: center; transition: all 0.4s ease; background: transparent; 
}

/* Navbar sólida en scroll o en Admin */
.navbar-scrolled {
  height: 75px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(15px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.nav-container { max-width: 1200px; margin: 0 auto; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 25px; }

.nav-logo { display: flex; align-items: center; text-decoration: none; gap: 12px; }
.logo-img { height: 48px; width: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #25d366; }

.brand-name { font-size: 1.5rem; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
.navbar-scrolled .brand-name { color: #004d4d; }
.accent { color: #25d366; }

.nav-links { display: flex; align-items: center; gap: 25px; }
.nav-item { text-decoration: none; color: rgba(255,255,255,0.9); font-weight: 600; font-size: 0.95rem; transition: 0.3s; }
.navbar-scrolled .nav-item { color: #555; }
.nav-item:hover { color: #25d366; }

.btn-admin-nav { 
  background: #004d4d; color: white; text-decoration: none; padding: 10px 20px; 
  border-radius: 50px; font-weight: 700; font-size: 0.85rem; transition: 0.3s;
}

.main-footer { text-align: center; padding: 60px 0; color: #888; font-size: 0.95rem; }
.footer-line { height: 1px; background: radial-gradient(circle, #eee 0%, transparent 100%); margin-bottom: 30px; }

@media (max-width: 768px) { .nav-item { display: none; } }
</style>