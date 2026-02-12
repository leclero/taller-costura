<template>
  <nav class="navbar" :class="{ 'navbar-solid': isScrolled || !isHome }">
    <div class="nav-container">
      
      <router-link to="/" class="nav-logo" @click="navegarA('inicio')">
        <img src="/Smith.jpg" alt="Logo" class="logo-img">
        <span class="logo-text">Teilor <span class="smith-accent-text">Smith</span></span>
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
        
        <router-link to="/admin" class="btn-smith btn-smith-primary" @click="menuOpen = false">
          Panel Admin
        </router-link>
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

const navegarA = (id) => {
  menuOpen.value = false; 
  if (route.path !== '/') {
    router.push('/').then(() => {
      ejecutarScroll(id);
    });
  } else {
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
  }, 100);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* NOTA: Ahora usamos var(--primary), var(--accent), etc. */

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  transition: 0.4s;
  padding: 15px 0;
}

.navbar-solid {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  /* Usamos la sombra del main.css */
  box-shadow: var(--shadow);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary);
}

.logo-text {
  font-weight: 800;
  font-size: 1.5rem;
  color: var(--primary);
  margin-left: 10px;
}

/* El rosa del taller definido en el CSS global */
.smith-accent-text { color: var(--accent); }

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}

.link-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  font-family: inherit;
}

/* Al pasar el mouse, usamos el rosa de la marca */
.link-btn:hover { color: var(--accent); }

/* Quitamos todos los estilos viejos de .btn-admin porque 
   ahora usamos btn-smith-primary del global */

@media (max-width: 768px) {
  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 280px;
    background: white;
    flex-direction: column;
    justify-content: center;
    transition: 0.4s;
    z-index: 1100;
    gap: 20px;
  }
  .nav-active { right: 0 !important; }
}
</style>