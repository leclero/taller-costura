<template>
  <nav class="navbar" :class="{ 'navbar-solid': isScrolled || !isHome }">
    <div class="nav-container">
      <router-link to="/" class="nav-logo" @click="navegarA('inicio')">
        <img src="/Smith.jpg" alt="Logo" class="logo-img">
        <span class="logo-text">Smith <span class="accent">Teilor</span></span>
      </router-link>

      <button class="menu-toggle" @click="menuOpen = !menuOpen" aria-label="Abrir menú">
        <div class="bar" :class="{ 'open': menuOpen }"></div>
        <div class="bar" :class="{ 'open': menuOpen }"></div>
        <div class="bar" :class="{ 'open': menuOpen }"></div>
      </button>

      <div class="nav-links" :class="{ 'nav-active': menuOpen }">
        <button @click="navegarA('inicio')" class="link-btn">Inicio</button>
        <button @click="navegarA('trabajos')" class="link-btn">Nuestro Trabajo</button>
        <button @click="navegarA('arreglos')" class="link-btn">Arreglos</button>
        <router-link to="/admin" class="btn-admin" @click="menuOpen = false">Panel Admin</router-link>
      </div>
    </div>
    <div v-if="menuOpen" class="nav-overlay" @click="menuOpen = false"></div>
  </nav>

  <router-view />
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isScrolled = ref(false);
const menuOpen = ref(false);
const isHome = computed(() => route.path === '/');

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

// Lógica de navegación inteligente
const navegarA = (id) => {
  menuOpen.value = false;
  
  if (route.path !== '/') {
    // Si NO estamos en el home, primero vamos al home
    router.push('/').then(() => {
      ejecutarScroll(id);
    });
  } else {
    // Si YA estamos en el home, solo hacemos scroll
    ejecutarScroll(id);
  }
};

const ejecutarScroll = (id) => {
  setTimeout(() => {
    if (id === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, 100); // Pequeño delay para asegurar que el DOM cargó
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Mantengo tus estilos originales y añado el estilo para los botones que ahora actúan como links */
.link-btn {
  background: none;
  border: none;
  color: #004d4d;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0;
  transition: 0.3s;
  font-family: inherit;
}

.link-btn:hover {
  color: #2ecc71;
}

.navbar { position: fixed; top: 0; width: 100%; z-index: 1000; transition: 0.4s; padding: 15px 0; }
.navbar-solid { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
.nav-logo { display: flex; align-items: center; text-decoration: none; gap: 12px; }
.logo-img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #004d4d; }
.logo-text { font-weight: 800; font-size: 1.5rem; color: #004d4d; letter-spacing: -0.5px; }
.accent { color: #2ecc71; }
.nav-links { display: flex; align-items: center; gap: 30px; }

.btn-admin { 
  background: #004d4d; 
  color: white !important; 
  padding: 10px 22px; 
  border-radius: 50px; 
  box-shadow: 0 4px 15px rgba(0,77,77,0.3);
  transition: 0.3s;
  text-decoration: none;
}
.btn-admin:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,77,77,0.4); }

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