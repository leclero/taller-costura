<template>
  <div class="home-wrapper">
    <header id="inicio" class="hero-premium">
      <div class="hero-content">
        <h1>Smith Teilor</h1>
        <p>Diseño y Excelencia en Costura</p>
      </div>
    </header>

    <main class="container">
      
      <section id="trabajos" class="category-section">
        <div class="section-header">
          <h2>📸 Nuestro Trabajo</h2>
          <p>Explora nuestras últimas creaciones</p>
        </div>
        <div class="carousel-container" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
          <div class="carousel-track" :style="{ transform: `translateX(-${slideTrabajo * 100}%)` }">
            <div v-for="p in filtrados('Nuestro Trabajo')" :key="p._id" class="carousel-slide">
              <div class="work-card">
                <div class="work-media">
                  <video v-if="esVideo(p.imagenUrl)" :src="p.imagenUrl" autoplay muted loop playsinline></video>
                  <img v-else :src="p.imagenUrl" :alt="p.nombre" @error="handleImgError">
                </div>
                <div class="work-info"><h3>{{ p.nombre }}</h3></div>
              </div>
            </div>
          </div>
          <button class="nav-arrow prev" @click="prevSlide">❮</button>
          <button class="nav-arrow next" @click="nextSlide">❯</button>
        </div>
      </section>

      <section id="reparaciones" class="category-section bg-light-section">
        <div class="section-header"><h2>🧵 Arreglos & Reparaciones</h2></div>
        <div class="interactive-grid">
          <div v-for="p in filtrados('Arreglo')" :key="p._id" class="grid-card">
            <div class="card-img">
              <img :src="p.imagenUrl" :alt="p.nombre" @error="handleImgError">
              <div class="overlay"><button @click="agregarAlCarrito(p)">Pedir Arreglo</button></div>
            </div>
            <div class="card-body">
              <h3>{{ p.nombre }}</h3>
              <p class="price">${{ p.precio.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="tienda" class="category-section">
        <div class="dropdown-control">
          <button @click="toggleTienda" class="btn-toggle-shop" :class="{ 'active': showTienda }">
            {{ showTienda ? '🔼 Cerrar Catálogo' : '🛍️ Ver Catálogo de Confecciones' }}
          </button>
        </div>

        <transition name="expand">
          <div v-if="showTienda" class="shop-content bg-dark-elegant">
            <h2 class="text-white text-center">Confecciones Disponibles</h2>
            
            <div class="modern-search-container">
              <div class="modern-search-box">
                <span class="search-icon">🔍</span>
                <input v-model="busqueda" placeholder="Buscar prenda..." />
              </div>
            </div>

            <div class="interactive-grid">
              <div v-for="p in catalogoConfecciones" :key="p._id" class="grid-card card-dark">
                <div class="card-img">
                  <img :src="p.imagenUrl" :alt="p.nombre" @error="handleImgError">
                  <div class="overlay"><button @click="agregarAlCarrito(p)">Añadir al Carrito</button></div>
                </div>
                <div class="card-body">
                  <h3>{{ p.nombre }}</h3>
                  <p class="price">${{ p.precio.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </section>

      <section class="category-section">
        <div class="section-header"><h2>💬 Lo que dicen mis clientes</h2></div>
        <div class="reviews-grid">
          <div class="review-card">
            <p>"Excelente atención y rapidez en los arreglos. ¡Súper recomendable!"</p>
            <strong>- Ana G.</strong>
          </div>
          <div class="review-card">
            <p>"Me hizo un vestido a medida que quedó impecable. Una artista."</p>
            <strong>- Laura S.</strong>
          </div>
        </div>
      </section>

      <section id="contacto" class="contact-section">
        <div class="contact-grid">
          <div class="info-box">
            <h3>📍 Ubicación en Luján</h3>
            <p>Dr. Muñiz 402, Luján</p>
            <div class="map-wrapper">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.632231908253!2d-59.1235176!3d-34.5704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzEzLjQiUyA1OcKwMDcnMjQuNyJX!5e0!3m2!1ses!2sar!4v1630000000000!5m2!1ses!2sar" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
          </div>
          <div class="social-box">
            <h3>📱 Redes Sociales</h3>
            <div class="social-buttons">
              <a href="https://www.instagram.com/taller_confecciones.smith" target="_blank" class="btn-ig">📸 Instagram</a>
              <a href="https://wa.me/5491168915378" target="_blank" class="btn-wa">💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <div class="ui-cart-master" v-if="totalItems > 0">
      <transition name="pop">
        <div class="ui-cart-panel" v-if="showCart" ref="cartContainer">
          <div class="ui-cart-header">
            <h4>Tu Pedido</h4>
            <button @click="showCart = false">✕</button>
          </div>
          <div class="ui-cart-body">
            <div v-for="item in carrito" :key="item._id" class="ui-cart-item">
              <div class="ui-item-info">
                <span>{{ item.nombre }}</span>
                <strong>${{ (item.precio * item.cantidad).toLocaleString() }}</strong>
              </div>
              <div class="ui-item-actions">
                <div class="ui-qty">
                  <button @click="modificarCantidad(item, -1)">-</button>
                  <span>{{ item.cantidad }}</span>
                  <button @click="modificarCantidad(item, 1)">+</button>
                </div>
                <button @click="quitarProducto(item._id)">🗑️</button>
              </div>
            </div>
          </div>
          <div class="ui-cart-footer">
            <div class="ui-total"><span>Total:</span> <strong>${{ totalPrecio.toLocaleString() }}</strong></div>
            <button @click="enviarWhatsApp" class="ui-btn-wa">Enviar a WhatsApp</button>
          </div>
        </div>
      </transition>
      
      <div class="ui-cart-icon" @click.stop="showCart = !showCart">
        🛒 <span class="ui-badge">{{ totalItems }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import axios from 'axios';

const prendas = ref([]);
const carrito = ref([]);
const showCart = ref(false);
const showTienda = ref(false);
const busqueda = ref('');
const slideTrabajo = ref(0);
const cartContainer = ref(null);
let timer = null;

const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';

const obtenerProductos = async () => {
  try { const res = await axios.get(API_URL); prendas.value = res.data; } 
  catch (e) { console.error(e); }
};

const filtrados = (cat) => prendas.value.filter(p => p.categoria === cat);
const esVideo = (url) => url && (url.includes('.mp4') || url.includes('.webm'));

const nextSlide = () => {
  const max = filtrados('Nuestro Trabajo').length;
  if (max > 0) slideTrabajo.value = (slideTrabajo.value + 1) % max;
};
const prevSlide = () => {
  const max = filtrados('Nuestro Trabajo').length;
  if (max > 0) slideTrabajo.value = (slideTrabajo.value - 1 + max) % max;
};
const startAutoPlay = () => { timer = setInterval(nextSlide, 4000); };
const stopAutoPlay = () => { clearInterval(timer); };

const toggleTienda = () => { showTienda.value = !showTienda.value; };

const catalogoConfecciones = computed(() => {
  return prendas.value.filter(p => p.categoria === 'Confección' && p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()));
});

const agregarAlCarrito = (p) => {
  const ex = carrito.value.find(i => i._id === p._id);
  if (ex) ex.cantidad++; else carrito.value.push({...p, cantidad: 1});
  showCart.value = true;
};

const modificarCantidad = (item, n) => { item.cantidad += n; if (item.cantidad < 1) quitarProducto(item._id); };
const quitarProducto = (id) => { 
  carrito.value = carrito.value.filter(i => i._id !== id); 
  if (!carrito.value.length) showCart.value = false;
};

const totalItems = computed(() => carrito.value.reduce((acc, i) => acc + i.cantidad, 0));
const totalPrecio = computed(() => carrito.value.reduce((acc, i) => acc + (i.precio * i.cantidad), 0));

const enviarWhatsApp = () => {
  const lista = carrito.value.map(p => `- ${p.cantidad}x ${p.nombre}`).join('\n');
  const msj = `¡Hola Smith Teilor! Mi pedido:\n${lista}\n\n*Total: $${totalPrecio.value.toLocaleString()}*`;
  window.open(`https://wa.me/5491168915378?text=${encodeURIComponent(msj)}`, '_blank');
};

const handleImgError = (e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Smith+Teilor'; };
const handleOutsideClick = (e) => { if (showCart.value && cartContainer.value && !cartContainer.value.contains(e.target)) showCart.value = false; };

onMounted(() => { 
  obtenerProductos(); 
  window.addEventListener('click', handleOutsideClick);
  startAutoPlay();
});
onUnmounted(() => { 
  window.removeEventListener('click', handleOutsideClick); 
  stopAutoPlay();
});
</script>

<style scoped>
/* GENERAL */
.home-wrapper { font-family: 'Inter', sans-serif; color: #333; }
.hero-premium { height: 40vh; background: #004d4d; color: white; display: flex; align-items: center; justify-content: center; text-align: center; }
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.section-header { text-align: center; margin-bottom: 40px; }
.text-center { text-align: center; }

/* CARRUSEL */
.carousel-container { position: relative; max-width: 500px; margin: 0 auto; overflow: hidden; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.carousel-track { display: flex; transition: transform 0.6s ease-in-out; }
.carousel-slide { min-width: 100%; }
.work-media { height: 400px; }
.work-media img, .work-media video { width: 100%; height: 100%; object-fit: cover; }
.work-info { padding: 15px; text-align: center; background: white; }
.nav-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,77,77,0.5); color: white; border: none; padding: 10px 15px; cursor: pointer; z-index: 5; border-radius: 50%; }
.prev { left: 10px; } .next { right: 10px; }

/* GRID & CARDS */
.bg-light-section { background: #f4f9f9; width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; padding: 60px 20px; }
.interactive-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 25px; }
.grid-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.05); position: relative; }
.card-img { height: 320px; position: relative; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.overlay { position: absolute; inset: 0; background: rgba(0,77,77,0.7); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
.grid-card:hover .overlay { opacity: 1; }
.overlay button { background: white; color: #004d4d; border: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer; }
.card-body { padding: 15px; text-align: center; }
.price { color: #25d366; font-weight: bold; font-size: 1.1rem; }

/* DROPDOWN & BUSCADOR */
.dropdown-control { display: flex; justify-content: center; margin: 40px 0; }
.btn-toggle-shop { background: #004d4d; color: white; border: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; cursor: pointer; }
.bg-dark-elegant { background: #121212; color: white; border-radius: 30px; padding: 40px 20px; margin-top: 20px; }
.modern-search-box { display: flex; align-items: center; background: rgba(255,255,255,0.1); padding: 12px 20px; border-radius: 50px; max-width: 400px; margin: 20px auto; }
.modern-search-box input { background: none; border: none; color: white; margin-left: 10px; width: 100%; outline: none; }
.card-dark { background: #1a1a1a !important; color: white !important; border: 1px solid #333 !important; }

/* COMENTARIOS */
.reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.review-card { background: #f9f9f9; padding: 25px; border-radius: 15px; border-left: 5px solid #004d4d; }

/* CONTACTO */
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; }
.map-wrapper { border-radius: 15px; overflow: hidden; margin-top: 15px; }
.social-buttons a { display: block; padding: 15px; margin-bottom: 10px; border-radius: 10px; color: white; text-decoration: none; text-align: center; font-weight: bold; }
.btn-ig { background: linear-gradient(45deg, #f09433, #bc1888); }
.btn-wa { background: #25d366; }

/* CARRITO BLINDADO (UI MASTER) */
.ui-cart-master { position: fixed; bottom: 30px; right: 30px; z-index: 999999; display: flex; flex-direction: column; align-items: flex-end; }
.ui-cart-icon { width: 70px; height: 70px; background: #004d4d; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.3); position: relative; }
.ui-badge { position: absolute; top: -5px; right: -5px; background: #ff4d4d; color: white; width: 25px; height: 25px; border-radius: 50%; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; border: 2px solid white; font-weight: bold; }
.ui-cart-panel { width: 320px; background: white; border-radius: 20px; padding: 20px; box-shadow: 0 15px 50px rgba(0,0,0,0.2); margin-bottom: 15px; color: #333; }
.ui-cart-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
.ui-cart-header button { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #999; }
.ui-cart-item { padding: 10px 0; border-bottom: 1px solid #f9f9f9; }
.ui-item-info { display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 600; }
.ui-item-actions { display: flex; justify-content: space-between; align-items: center; }
.ui-qty { display: flex; align-items: center; gap: 10px; background: #f0f0f0; padding: 3px 10px; border-radius: 20px; }
.ui-qty button { background: none; border: none; font-weight: bold; cursor: pointer; }
.ui-btn-wa { width: 100%; background: #25d366; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 10px; }
.ui-total { display: flex; justify-content: space-between; padding-top: 10px; font-size: 1.1rem; }

/* ANIMACIONES */
.pop-enter-active { animation: pop-in 0.4s; }
@keyframes pop-in { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.expand-enter-active, .expand-leave-active { transition: all 0.5s ease; max-height: 2000px; opacity: 1; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }

@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } .ui-cart-panel { width: calc(100vw - 60px); } }
</style>