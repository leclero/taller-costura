<template>
  <div class="smith-teilor-app">
    <header class="hero-premium">
      <div class="hero-content">
        <h1>Teilor Smith</h1>
        <p>Alta Costura & Confección Personalizada</p>
      </div>
    </header>

    <main class="main-content">

      <section id="trabajos" class="section-container">
        <div class="header-text">
          <h2>📸 Nuestro Trabajo</h2>
        </div>
        <div class="carousel-viewport" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
          <div class="carousel-track" :style="{ transform: `translateX(-${slideTrabajo * 100}%)` }">
            <div v-for="p in trabajos" :key="p._id" class="slide">
              <div class="work-card">
                <div class="media-holder">
                  <video v-if="esVideo(p.imagenUrl)" :src="p.imagenUrl" autoplay muted loop playsinline></video>
                  <img v-else :src="p.imagenUrl" :alt="p.nombre" @error="handleImgError">
                </div>
                <div class="work-label">
                  <h3>{{ p.nombre }}</h3>
                </div>
              </div>
            </div>
          </div>
          <button class="arrow prev" @click="prevSlide">❮</button>
          <button class="arrow next" @click="nextSlide">❯</button>
        </div>
      </section>

      <section id="arreglos" class="section-container bg-soft">
        <div class="header-text">
          <h2>🧵 Arreglos & Reparaciones</h2>
        </div>
        <div class="st-grid">
          <div v-for="p in filtrados('Arreglo')" :key="p._id" class="st-card">
            <div class="st-img-box">
              <img :src="p.imagenUrl" :alt="p.nombre">
              <div class="st-card-hover">
                <button @click="agregarAlCarrito(p)" class="st-btn-buy">Pedir Arreglo</button>
              </div>
            </div>
            <div class="st-card-body">
              <h3>{{ p.nombre }}</h3>
              <p class="st-price">${{ p.precio.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="tienda" class="section-container">
        <div class="st-cta-wrapper">
          <button @click="toggleTienda" class="st-btn-pill-catalog" :class="{ 'is-open': showTienda }">
            <span class="st-icon">{{ showTienda ? '✕' : '🛍️' }}</span>
            <span class="st-text">{{ showTienda ? 'Cerrar Catálogo' : 'Explorar Catálogo de Confecciones' }}</span>
          </button>
        </div>

        <transition name="st-expand">
          <div v-if="showTienda" class="st-catalog-expand">
            <div class="st-search-wrapper">
              <div class="st-search-box">
                <span class="st-search-icon">🔍</span>
                <input v-model="busqueda" placeholder="Buscar prenda..." class="st-modern-input" />
              </div>
            </div>
            <div class="st-grid">
              <div v-for="p in catalogoConfecciones" :key="p._id" class="st-card">
                <div class="st-img-box">
                  <img :src="p.imagenUrl" :alt="p.nombre">
                  <div class="st-card-hover">
                    <button @click="agregarAlCarrito(p)" class="st-btn-buy">Añadir al Carrito</button>
                  </div>
                </div>
                <div class="st-card-body">
                  <h3>{{ p.nombre }}</h3>
                  <p class="st-price">${{ p.precio.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </section>

      <section class="section-container bg-soft">
        <div class="header-text">
          <h2>💬 Opiniones de Clientes</h2>
        </div>
        <div class="st-reviews-container">
          <div class="st-review-card">
            <div class="st-stars">★★★★★</div>
            <p>"Excelente atención y prolijidad total. Los arreglos quedaron impecables."</p>
            <span class="st-author">— Ana G.</span>
          </div>
          <div class="st-review-card">
            <div class="st-stars">★★★★★</div>
            <p>"La mejor costurera de Luján. Hizo mi vestido soñado a medida."</p>
            <span class="st-author">— Laura S.</span>
          </div>
        </div>
      </section>

      <section id="contacto" class="section-container">
        <div class="st-contact-layout">
          <div class="st-map-box">
            <h3>📍 Mi Taller en Luján</h3>
            <p>Dr. Muñiz 402, Luján</p>
            <div class="st-frame-wrap">
              <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.472714571619!2d-59.123547!3d-34.572132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc7e953157d77b%3A0x6b1f2389d3876e6b!2sDr.%20Mu%C3%B1iz%20402%2C%20B6700%20Luj%C3%A1n%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1715000000000!5m2!1ses-419!2sar"
  width="100%" 
  height="250" 
  style="border:0;" 
  allowfullscreen="" 
  loading="lazy" 
  referrerpolicy="no-referrer-when-downgrade">
</iframe>
            </div>
          </div>
          <div class="st-social-box">
            <h3>📱 Redes Sociales</h3>
            <div class="st-social-pills">
              <a href="https://www.instagram.com/taller_confecciones.smith" target="_blank"
                class="st-pill ig">Instagram</a>
              <a href="https://wa.me/5491168915378" target="_blank" class="st-pill wa">WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="st-footer">
      <div class="st-footer-content">
        <div class="st-footer-brand">
          <h2>Teilor Smith</h2>
          <p>Pasión por la costura, compromiso con la calidad.</p>
        </div>
        <div class="st-footer-info">
          <div class="st-info-item">
            <strong>📍 Dirección</strong>
            <span>Dr. Muñiz 402, Luján, Bs.As.</span>
          </div>
          <div class="st-info-item">
            <strong>⏰ Horarios</strong>
            <span>Lun a Vie: 09:00 - 18:00</span>
          </div>
        </div>
      </div>
      <div class="st-footer-bottom">
        <p>© 2026 Teilor Smith - Todos los derechos reservados.</p>
      </div>
    </footer>

    <div class="st-cart-root" v-if="totalItems > 0">
      <transition name="st-cart-slide">
        <div class="st-cart-window" v-if="showCart" ref="cartContainer">
          <div class="st-cart-head">
            <div class="st-head-info">
              <strong>Mi Pedido</strong>
              <small>{{ totalItems }} prendas</small>
            </div>
            <button @click="vaciarCarrito" class="st-btn-clear">Vaciar</button>
            <button @click="showCart = false" class="st-btn-close">✕</button>
          </div>
          <div class="st-cart-body">
            <div v-for="item in carrito" :key="item._id" class="st-cart-item">
              <div class="st-item-top">
                <span>{{ item.nombre }}</span>
                <strong>${{ (item.precio * item.cantidad).toLocaleString() }}</strong>
              </div>
              <div class="st-item-bottom">
                <div class="st-qty-group">
                  <button @click="modificarCantidad(item, -1)">−</button>
                  <span class="st-qty-val">{{ item.cantidad }}</span>
                  <button @click="modificarCantidad(item, 1)">+</button>
                </div>
                <button @click="quitarProducto(item._id)" class="st-del-btn">🗑️</button>
              </div>
            </div>
          </div>
          <div class="st-cart-foot">
            <div class="st-total">Total: <strong>${{ totalPrecioCalculado.toLocaleString() }}</strong></div>
            <button @click="enviarWhatsApp" class="st-btn-checkout">Confirmar por WhatsApp ➔</button>
          </div>
        </div>
      </transition>
      <div class="st-fab" @click.stop="showCart = !showCart">
        🛒 <span class="st-badge">{{ totalItems }}</span>
      </div>
    </div>

    <button @click="volverArriba" class="btn-scroll-top" :class="{ 'show': showScrollBtn }">
      ↑
    </button>
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
const showScrollBtn = ref(false); // Ref para el botón de arriba
let timer = null;

const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';

const obtenerProductos = async () => {
  try {
    const res = await axios.get(API_URL);
    prendas.value = res.data;
  } catch (e) {
    console.error("Error API:", e);
  }
};

const filtrados = (cat) => prendas.value.filter(p => p.categoria === cat);
const trabajos = computed(() => filtrados('Nuestro Trabajo'));
const esVideo = (url) => url && (url.includes('.mp4') || url.includes('.webm'));

const catalogoConfecciones = computed(() => {
  return prendas.value.filter(p =>
    p.categoria === 'Confección' &&
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  );
});

// Navegación y Scroll
const volverArriba = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleScroll = () => {
  showScrollBtn.value = window.scrollY > 400;
};

// Carrusel
const nextSlide = () => { if (trabajos.value.length) slideTrabajo.value = (slideTrabajo.value + 1) % trabajos.value.length; };
const prevSlide = () => { if (trabajos.value.length) slideTrabajo.value = (slideTrabajo.value - 1 + trabajos.value.length) % trabajos.value.length; };
const startAutoPlay = () => { if (!timer) timer = setInterval(nextSlide, 5000); };
const stopAutoPlay = () => { clearInterval(timer); timer = null; };

// Carrito
const agregarAlCarrito = (p) => {
  const ex = carrito.value.find(i => i._id === p._id);
  if (ex) ex.cantidad++; else carrito.value.push({ ...p, cantidad: 1 });
};

const modificarCantidad = (item, n) => { item.cantidad += n; if (item.cantidad < 1) quitarProducto(item._id); };
const quitarProducto = (id) => {
  carrito.value = carrito.value.filter(i => i._id !== id);
  if (!carrito.value.length) showCart.value = false;
};
const vaciarCarrito = () => { if (confirm("¿Deseas vaciar el pedido completo?")) { carrito.value = []; showCart.value = false; } };

const totalItems = computed(() => carrito.value.reduce((acc, i) => acc + i.cantidad, 0));
const totalPrecioCalculado = computed(() => carrito.value.reduce((acc, i) => acc + (i.precio * i.cantidad), 0));

const enviarWhatsApp = () => {
  const lista = carrito.value.map(p => `• ${p.cantidad}x ${p.nombre}`).join('\n');
  const msj = `¡Hola Teilor Smith! 👋\nHe armado este pedido:\n\n${lista}\n\n*Total: $${totalPrecioCalculado.value.toLocaleString()}*`;
  window.open(`https://wa.me/5491168915378?text=${encodeURIComponent(msj)}`, '_blank');
};

const toggleTienda = () => { showTienda.value = !showTienda.value; };
const handleImgError = (e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Smith+Teilor'; };

const handleOutsideClick = (e) => {
  if (showCart.value && cartContainer.value && !cartContainer.value.contains(e.target)) {
    showCart.value = false;
  }
};

onMounted(() => {
  obtenerProductos();
  window.addEventListener('click', handleOutsideClick);
  window.addEventListener('scroll', handleScroll); // Activar scroll listener
  startAutoPlay();
});
onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
  window.removeEventListener('scroll', handleScroll); // Limpiar listener
  stopAutoPlay();
});
</script>

<style scoped>
/* BASES */
.smith-teilor-app {
  background: #fdfdfd;
  color: #333;
  font-family: 'Inter', sans-serif;
  width: 100%;
  overflow-x: hidden;
}

.hero-premium {
  height: 40vh;
  background: #004d4d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
}

.section-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 20px;
}

.header-text {
  text-align: center;
  margin-bottom: 40px;
}

.bg-soft {
  background: #f4f7f7;
  border-radius: 40px;
}

/* BOTÓN VOLVER ARRIBA */
.btn-scroll-top {
  position: fixed;
  bottom: 120px; /* Un poco más arriba para no tapar el carrito si aparece */
  right: 30px;
  width: 50px;
  height: 50px;
  background: #004d4d;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-scroll-top.show {
  opacity: 1;
  visibility: visible;
}

.btn-scroll-top:hover {
  background: #006666;
  transform: scale(1.1);
}

/* CATÁLOGO */
.st-cta-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px 0 40px;
}

.st-btn-pill-catalog {
  background: #004d4d;
  color: white;
  border: none;
  padding: 18px 40px;
  border-radius: 100px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 10px 25px rgba(0, 77, 77, 0.2);
}

.st-btn-pill-catalog.is-open {
  background: #ff4757;
}

/* REVIEWS */
.st-reviews-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.st-review-card {
  background: white;
  padding: 30px;
  border-radius: 25px;
  max-width: 400px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  border-bottom: 6px solid #004d4d;
}

.st-stars {
  color: #f1c40f;
  margin-bottom: 10px;
}

.st-author {
  display: block;
  margin-top: 15px;
  font-weight: bold;
  color: #004d4d;
}

/* CARRITO FLOTANTE */
.st-cart-root {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 10000;
}

.st-fab {
  width: 75px;
  height: 75px;
  background: #004d4d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
}

.st-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff4757;
  color: white;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.st-cart-window {
  position: absolute;
  bottom: 85px;
  right: 0;
  width: 350px;
  background: white;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

/* GRID Y CARDS */
.st-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
}

.st-card {
  background: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.st-img-box {
  height: 320px;
  position: relative;
}

.st-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.st-card-hover {
  position: absolute;
  inset: 0;
  background: rgba(0, 77, 77, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.3s;
}

.st-card:hover .st-card-hover { opacity: 1; }

.st-btn-buy {
  background: white;
  color: #004d4d;
  border: none;
  padding: 12px 25px;
  border-radius: 50px;
  font-weight: 800;
}

.st-card-body { padding: 20px; text-align: center; }
.st-price { color: #2ecc71; font-weight: 800; font-size: 1.3rem; }

/* FOOTER */
.st-footer {
  background: #1a1a1a;
  color: #fdfdfd;
  padding: 60px 20px 20px;
}

.st-footer-content {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.st-footer-bottom { text-align: center; padding-top: 25px; opacity: 0.5; font-size: 0.85rem; }

/* CARRUSEL */
.carousel-viewport {
  position: relative;
  max-width: 450px;
  margin: 0 auto;
  border-radius: 30px;
  overflow: hidden;
}

.carousel-track { display: flex; transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.slide { min-width: 100%; }
.media-holder { height: 450px; }
.media-holder img, .media-holder video { width: 100%; height: 100%; object-fit: cover; }

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
}

.prev { left: 15px; }
.next { right: 15px; }

/* OTROS */
.st-modern-input {
  width: 100%;
  padding: 16px 20px 16px 55px;
  border-radius: 50px;
  border: 2px solid #eee;
  outline: none;
}

.st-pill {
  padding: 16px;
  border-radius: 18px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
  text-align: center;
}

.ig { background: linear-gradient(45deg, #f09433, #bc1888); }
.wa { background: #25d366; }
</style>