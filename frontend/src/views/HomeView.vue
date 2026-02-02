<template>
  <div class="home">
    <header class="hero">
      <h1>🧵 Catálogo del Taller</h1>
      <p>Nuestros trabajos más recientes</p>
    </header>

    <div v-if="loading" class="loader">Cargando prendas...</div>

    <div v-else class="grid-prendas">
      <div v-for="prenda in prendas" :key="prenda._id" class="card">
        <div class="image-container">
          <img :src="prenda.imagenUrl" :alt="prenda.nombre">
          <span class="badge">{{ prenda.categoria }}</span>
        </div>
        <div class="info">
          <h3>{{ prenda.nombre }}</h3>
          <p class="precio">${{ prenda.precio }}</p>
          <button class="btn-pedido">Consultar por WhatsApp</button>
        </div>
      </div>
    </div>
    
    <div v-if="!cargando && prendas.length === 0" class="empty">
      Todavía no hay prendas publicadas. ¡Ve al panel de Admin!
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const prendas = ref([]);
const loading = ref(true);

const obtenerPrendas = async () => {
  try {
    const response = await axios.get('https://api-taller-costura.onrender.com/api/prendas');
    prendas.value = response.data;
  } catch (error) {
    console.error("Error al obtener prendas:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(obtenerPrendas);
</script>

<style scoped>
.grid-prendas { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; padding: 20px; }
.card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s; }
.card:hover { transform: translateY(-5px); }
.image-container { position: relative; height: 300px; }
.image-container img { width: 100%; height: 100%; object-fit: cover; }
.badge { position: absolute; top: 10px; right: 10px; background: #ff69b4; color: white; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; }
.info { padding: 15px; text-align: center; }
.precio { color: #ff69b4; font-weight: bold; font-size: 1.2rem; }
.loader { text-align: center; padding: 50px; font-size: 1.5rem; }
</style>