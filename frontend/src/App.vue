<template>
  <nav class="navbar" :class="{ 'navbar-solid': isScrolled || !isHome }">
    <div class="nav-container">
      <router-link to="/" class="nav-logo" @click="menuOpen = false">
        <img src="/Smith.jpg" alt="Logo" class="logo-img">
        <span class="logo-text">Smith <span class="accent">Teilor</span></span>
      </router-link>

      <button class="menu-toggle" @click="menuOpen = !menuOpen" aria-label="Abrir menú">
        <div class="bar" :class="{ 'open': menuOpen }"></div>
        <div class="bar" :class="{ 'open': menuOpen }"></div>
        <div class="bar" :class="{ 'open': menuOpen }"></div>
      </button>

      <div class="nav-links" :class="{ 'nav-active': menuOpen }">
        <router-link to="/" @click="menuOpen = false">Inicio</router-link>
        <a href="#trabajos" @click="menuOpen = false">Nuestro Trabajo</a>
        <a href="#arreglos" @click="menuOpen = false">Arreglos</a>
        <router-link to="/admin" class="btn-admin" @click="menuOpen = false">Panel Admin</router-link>
      </div>
    </div>
    <div v-if="menuOpen" class="nav-overlay" @click="menuOpen = false"></div>
  </nav>

  <router-view />
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isScrolled = ref(false);
const menuOpen = ref(false);
const isHome = computed(() => route.path === '/');

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.navbar { position: fixed; top: 0; width: 100%; z-index: 1000; transition: 0.4s; padding: 15px 0; }
.navbar-solid { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
.nav-logo { display: flex; align-items: center; text-decoration: none; gap: 12px; }
.logo-img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #004d4d; }
.logo-text { font-weight: 800; font-size: 1.5rem; color: #004d4d; letter-spacing: -0.5px; }
.accent { color: #2ecc71; }
.nav-links { display: flex; align-items: center; gap: 30px; }
.nav-links a { text-decoration: none; color: #004d4d; font-weight: 700; font-size: 0.95rem; transition: 0.3s; }
.nav-links a:hover { color: #2ecc71; }

.btn-admin { 
  background: #004d4d; 
  color: white !important; 
  padding: 10px 22px; 
  border-radius: 50px; /* Estilo Pill */
  box-shadow: 0 4px 15px rgba(0,77,77,0.3);
  transition: 0.3s;
}
.btn-admin:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,77,77,0.4); }

/* Hamburguesa y Mobile igual que antes pero con colores actualizados */
@media (max-width: 768px) {
  .menu-toggle { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; }
  .bar { width: 28px; height: 3px; background: #004d4d; border-radius: 10px; transition: 0.3s; }
  .nav-links {
    position: fixed; top: 0; right: -100%; height: 100vh; width: 280px;
    background: white; flex-direction: column; justify-content: center;
    gap: 30px; transition: 0.4s; z-index: 1100; box-shadow: -10px 0 30px rgba(0,0,0,0.1);
  }
  .nav-active { right: 0 !important; }
}
</style>