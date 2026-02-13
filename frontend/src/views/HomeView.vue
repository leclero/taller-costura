<template>
  <div class="smith-teilor-app">
    <transition name="fade">
      <button v-show="scrolled" @click="scrollToTop" class="btn-scroll-top" title="Volver arriba">
        ↑
      </button>
    </transition>

    <header class="hero-premium">
      <div class="hero-content">
        <h1>Teilor Smith</h1>
        <p>Corte y Confección: Guardapolvos, pijamas y blanco para el hogar. Especialistas en arreglos de cierres, bolsos, carteras y reformas en general.</p>
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
                <button @click="agregarAlCarrito(p)" class="st-btn-add">Añadir al Carrito</button>
              </div>
            </div>
            <div class="st-card-body">
              <h3>{{ p.nombre }}</h3>
              <p class="st-price">${{ p.precio.toLocaleString() }}</p>
              <button @click="agregarAlCarrito(p)" class="st-btn-mobile">Añadir al Carrito</button>
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
                    <button @click="agregarAlCarrito(p)" class="st-btn-add">Añadir al Carrito</button>
                  </div>
                </div>
                <div class="st-card-body">
                  <h3>{{ p.nombre }}</h3>
                  <p class="st-price">${{ p.precio.toLocaleString() }}</p>
                  <button @click="agregarAlCarrito(p)" class="st-btn-mobile">Añadir al Carrito</button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </section>

      <section class="section-container bg-soft">
        <div class="header-text">
          <h2>💬 Opiniones de Clientes</h2>
          <p>La confianza de nuestros vecinos es lo primero</p>
        </div>
        
        <div class="st-reviews-carousel">
          <transition name="fade-review" mode="out-in">
            <div v-if="opinionesDeAPI.length > 0" :key="indiceOpinion" class="st-review-bubble active">
              <div class="st-stars">★★★★★</div>
              <p>"{{ formatearOpinion(opinionesDeAPI[indiceOpinion].nombre).texto }}"</p>
              <span class="st-author">— {{ formatearOpinion(opinionesDeAPI[indiceOpinion].nombre).autor }}</span>
            </div>
            
            <div v-else class="st-review-bubble active">
              <div class="st-stars">★★★★★</div>
              <p>"Excelente atención y prolijidad total en todos los trabajos."</p>
              <span class="st-author">— Ana G.</span>
            </div>
          </transition>
        </div>

        <div class="st-testimonial-action">
           <button @click="enviarTestimonio" class="st-btn-testimonial">
             ✨ ¡Déjanos tu opinión por WhatsApp!
           </button>
        </div>
      </section>

      <section id="contacto" class="section-container">
        <div class="st-contact-layout">
          <div class="st-map-box">
            <h3>📍 Mi Taller en Luján</h3>
            <p>Dr. Muñiz 402, Luján</p>
            <div class="st-frame-wrap">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.083818625974!2d-59.1171822!3d-34.577544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc7dfa81e3a65f%3A0xc310e3020616b20!2sDr.%20Mu%C3%B1iz%20402%2C%20Luj%C3%A1n%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1700000000000" width="100%" height="250" style="border:0; border-radius: 20px;" allowfullscreen="" loading="lazy"></iframe>
            </div>
          </div>
          <div class="st-social-box">
            <h3>📱 Redes Sociales</h3>
            <div class="st-social-pills">
              <a href="https://www.instagram.com/taller_confecciones.smith" target="_blank" class="st-pill ig">Instagram</a>
              <a href="https://wa.me/5491168915378" target="_blank" class="st-pill wa">WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="st-footer-black">
      <div class="st-footer-content">
        <h3>Teilor Smith</h3>
        <p>Pasión por la costura, compromiso con la calidad.</p>
        <p>📍 Dr. Muñiz 402, Luján, Bs.As. | ⏰ Lun a Vie: 09:00 - 18:00</p>
        <p>© 2026 Teilor Smith - Todos los derechos reservados.</p>
      </div>
    </footer>

    <div class="st-cart-container" v-if="totalItems > 0">
      <transition name="bubble">
        <div v-if="showCart" class="st-cart-bubble">
          <div class="st-cart-header">
            <h3>Tu Pedido</h3>
            <button @click="showCart = false" class="close-btn">✕</button>
          </div>
          
          <div class="st-cart-body">
            <div v-for="item in carrito" :key="item._id" class="cart-item">
              <div class="cart-item-info">
                <span class="cart-item-name">{{ item.nombre }}</span>
                <span class="cart-item-price">${{ (item.precio * item.cantidad).toLocaleString() }}</span>
              </div>
              <div class="cart-item-actions">
                <button @click="modificarCantidad(item, -1)" class="btn-qty">-</button>
                <span class="qty-num">{{ item.cantidad }}</span>
                <button @click="modificarCantidad(item, 1)" class="btn-qty">+</button>
                <button @click="eliminarDelCarrito(item)" class="btn-del">🗑️</button>
              </div>
            </div>
          </div>

          <div class="st-cart-footer">
            <div class="total-row">
              <span>Total:</span>
              <span>${{ totalDinero.toLocaleString() }}</span>
            </div>
            <div class="st-cart-btns-flex">
              <button @click="vaciarCarrito" class="st-btn-empty-bubble">Vaciar</button>
              <button @click="finalizarWhatsApp" class="st-btn-checkout">WhatsApp</button>
            </div>
          </div>
        </div>
      </transition>

      <div class="st-fab" @click="showCart = !showCart">
        🛒 <span class="st-badge">{{ totalItems }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import axios from 'axios';

const prendas = ref([]);
const carrito = ref([]);
const showCart = ref(false);
const showTienda = ref(false);
const busqueda = ref('');
const slideTrabajo = ref(0);
const scrolled = ref(false);
const indiceOpinion = ref(0);
let timer = null;
let timerOpiniones = null;

const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';

// --- LÓGICA DE OPINIONES ---
const opinionesDeAPI = computed(() => {
  return prendas.value.filter(p => p.categoria === 'Opinión');
});

// Función para separar el nombre del texto (Ej: "Buena atención - Juan" -> {texto: "Buena atención", autor: "Juan"})
const formatearOpinion = (textoCompleto) => {
  let separador = textoCompleto.includes('—') ? '—' : (textoCompleto.includes('-') ? '-' : null);
  
  if (separador) {
    const partes = textoCompleto.split(separador);
    return {
      texto: partes[0].trim(),
      autor: partes[1].trim()
    };
  }
  return { texto: textoCompleto, autor: "Cliente de Teilor Smith" };
};

const rotarOpiniones = () => {
  if (opinionesDeAPI.value.length > 0) {
    indiceOpinion.value = (indiceOpinion.value + 1) % opinionesDeAPI.value.length;
  }
};

const enviarTestimonio = () => {
  const mensaje = "Hola Teilor! Quería dejarte un testimonio sobre tu trabajo: ";
  window.open(`https://wa.me/5491168915378?text=${encodeURIComponent(mensaje)}`, '_blank');
};
// ----------------------------

watch(carrito, (nuevoCarrito) => {
  if (nuevoCarrito.length === 0) showCart.value = false;
}, { deep: true });

const handleScroll = () => { scrolled.value = window.scrollY > 300; };
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

const obtenerProductos = async () => {
  try {
    const res = await axios.get(API_URL);
    prendas.value = res.data;
  } catch (e) { console.error("Error API:", e); }
};

const filtrados = (cat) => prendas.value.filter(p => p.categoria === cat);
const trabajos = computed(() => filtrados('Nuestro Trabajo'));
const esVideo = (url) => url && (url.includes('.mp4') || url.includes('.webm') || url.includes('/video/'));

const catalogoConfecciones = computed(() => {
  return prendas.value.filter(p => 
    p.categoria === 'Confección' && 
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  );
});

const nextSlide = () => { if (trabajos.value.length) slideTrabajo.value = (slideTrabajo.value + 1) % trabajos.value.length; };
const prevSlide = () => { if (trabajos.value.length) slideTrabajo.value = (slideTrabajo.value - 1 + trabajos.value.length) % trabajos.value.length; };
const startAutoPlay = () => { timer = setInterval(nextSlide, 5000); };
const stopAutoPlay = () => { clearInterval(timer); };

const agregarAlCarrito = (p) => {
  const ex = carrito.value.find(i => i._id === p._id);
  if (ex) ex.cantidad++; else carrito.value.push({ ...p, cantidad: 1 });
};

const modificarCantidad = (item, cambio) => {
  item.cantidad += cambio;
  if (item.cantidad < 1) eliminarDelCarrito(item);
};

const eliminarDelCarrito = (item) => {
  carrito.value = carrito.value.filter(i => i._id !== item._id);
};

const vaciarCarrito = () => {
  if (confirm("¿Seguro que quieres vaciar el carrito?")) carrito.value = [];
};

const totalItems = computed(() => carrito.value.reduce((acc, i) => acc + i.cantidad, 0));
const totalDinero = computed(() => carrito.value.reduce((acc, i) => acc + (i.precio * i.cantidad), 0));

const finalizarWhatsApp = () => {
  let mensaje = "Hola Teilor Smith! Quiero realizar el siguiente pedido:%0A%0A";
  carrito.value.forEach(i => {
    mensaje += `• ${i.nombre} (x${i.cantidad}): $${(i.precio * i.cantidad).toLocaleString()}%0A`;
  });
  mensaje += `%0A*Total: $${totalDinero.value.toLocaleString()}*`;
  window.open(`https://wa.me/5491168915378?text=${mensaje}`, '_blank');
};

const handleImgError = (e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Prenda'; };

onMounted(() => { 
  obtenerProductos(); 
  startAutoPlay(); 
  // Rotación lenta: cada 9 segundos
  timerOpiniones = setInterval(rotarOpiniones, 9000);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => { 
  stopAutoPlay(); 
  clearInterval(timerOpiniones);
  window.removeEventListener('scroll', handleScroll);
});

const toggleTienda = () => { showTienda.value = !showTienda.value; };
</script>

<style scoped>
/* ESTILOS CARRUSEL OPINIONES */
.st-reviews-carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 220px;
}
.fade-review-enter-active, .fade-review-leave-active {
  transition: all 0.8s ease;
}
.fade-review-enter-from { opacity: 0; transform: translateY(10px); }
.fade-review-leave-to { opacity: 0; transform: translateY(-10px); }

/* Estilos Originales */
.smith-teilor-app { background: #fdfdfd; color: #333; font-family: 'Inter', sans-serif; overflow-x: hidden;}
.btn-scroll-top { position: fixed; bottom: 100px; right: 30px; width: 45px; height: 45px; background: #004d4d; color: white; border: none; border-radius: 50%; font-size: 20px; cursor: pointer; z-index: 999; box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; transition: 0.3s; }
.hero-premium { height: 40vh; background: #004d4d; color: white; display: flex; align-items: center; justify-content: center; text-align: center; padding: 0 20px; }
.hero-content h1 { font-size: 3.5rem; font-weight: 800; margin: 0; }
.section-container { max-width: 1100px; margin: 0 auto; padding: 60px 20px; }
.bg-soft { background: #f4f7f7; border-radius: 40px; }
.header-text { text-align: center; margin-bottom: 40px; }
.st-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px; }
.st-card { background: white; border-radius: 25px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center; }
.st-img-box { height: 320px; position: relative; }
.st-img-box img { width: 100%; height: 100%; object-fit: cover; }
.st-card-hover { position: absolute; inset: 0; background: rgba(0, 77, 77, 0.7); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
.st-card:hover .st-card-hover { opacity: 1; }
.st-btn-add { background: white; color: #004d4d; border: none; padding: 12px 24px; border-radius: 50px; font-weight: 800; cursor: pointer; transform: translateY(20px); transition: 0.3s ease; }
.st-card:hover .st-btn-add { transform: translateY(0); }
.st-btn-mobile { display: none; background: #004d4d; color: white; border: none; padding: 10px; border-radius: 10px; margin: 10px auto; width: 90%; cursor: pointer; font-weight: bold;}
@media (max-width: 768px) { .st-btn-mobile { display: block; } .st-card-hover { display: none !important; } }
.st-price { color: #2ecc71; font-weight: 800; font-size: 1.3rem; margin: 10px 0; }
.st-cta-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
.st-btn-pill-catalog { background: #004d4d; color: white; border: none; padding: 15px 30px; border-radius: 50px; font-weight: bold; cursor: pointer; }
.st-btn-pill-catalog.is-open { background: #ff4757; }
.st-search-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
.st-search-box { display: flex; align-items: center; background: white; border: 2px solid #eee; border-radius: 15px; padding: 0 15px; width: 100%; max-width: 400px; }
.st-modern-input { border: none !important; padding: 12px; width: 100%; outline: none; }
.st-review-bubble { background: white; padding: 30px; border-radius: 30px; max-width: 600px; width: 100%; box-shadow: 0 10px 20px rgba(0,0,0,0.05); text-align: center; }
.st-stars { color: #f1c40f; margin-bottom: 10px; font-size: 1.2rem; }
.st-author { font-style: italic; color: #666; font-weight: bold; display: block; margin-top: 10px; }
.st-testimonial-action { text-align: center; margin-top: 30px; }
.st-btn-testimonial { background: #25d366; color: white; border: none; padding: 12px 25px; border-radius: 50px; font-weight: bold; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3); }
.st-btn-testimonial:hover { transform: scale(1.05); background: #20ba5a; }
.st-social-pills { display: flex; gap: 15px; justify-content: center; margin-top: 15px; }
.st-pill { padding: 12px 25px; border-radius: 50px; text-decoration: none; font-weight: bold; color: white; }
.st-pill.ig { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
.st-pill.wa { background: #25d366; }
.carousel-viewport { position: relative; max-width: 450px; margin: 0 auto; border-radius: 30px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.carousel-track { display: flex; transition: 0.6s ease-in-out; }
.slide { min-width: 100%; }
.media-holder { height: 450px; background: #eee; }
.media-holder img, .media-holder video { width: 100%; height: 100%; object-fit: cover; }
.arrow { position: absolute; top: 50%; transform: translateY(-50%); background: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; z-index: 10; font-weight: bold;}
.prev { left: 10px; } .next { right: 10px; }
.st-footer-black { background: #1a1a1a; color: white; padding: 40px 20px; text-align: center; }
.st-cart-container { position: fixed; bottom: 30px; right: 30px; z-index: 2000; }
.st-cart-bubble { position: absolute; bottom: 75px; right: 0; width: 320px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); padding: 15px; border: 1px solid #eee; display: flex; flex-direction: column; }
.st-cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #f0f0f0; padding-bottom: 5px; }
.st-cart-header h3 { margin: 0; font-size: 1.1rem; color: #004d4d; }
.close-btn { background: none; border: none; font-size: 18px; cursor: pointer; color: #999; }
.st-cart-body { max-height: 250px; overflow-y: auto; }
.cart-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #fafafa; }
.cart-item-info { display: flex; flex-direction: column; font-size: 0.9rem; }
.cart-item-name { font-weight: 600; }
.cart-item-actions { display: flex; align-items: center; gap: 6px; }
.btn-qty { background: #f0f0f0; border: none; width: 22px; height: 22px; border-radius: 4px; cursor: pointer; }
.btn-del { background: none; border: none; cursor: pointer; font-size: 0.9rem; }
.st-cart-footer { margin-top: 10px; padding-top: 10px; border-top: 1px solid #f0f0f0; }
.total-row { display: flex; justify-content: space-between; font-weight: 800; margin-bottom: 10px; }
.st-cart-btns-flex { display: flex; gap: 8px; }
.st-btn-empty-bubble { background: #fff; color: #ff4757; border: 1px solid #ff4757; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; flex: 1; font-size: 0.85rem; }
.st-btn-checkout { background: #25d366; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; flex: 2; font-size: 0.85rem; }
.st-fab { width: 60px; height: 60px; background: #004d4d; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.3); position: relative; }
.st-badge { position: absolute; top: -5px; right: -5px; background: #ff4757; width: 22px; height: 22px; border-radius: 50%; font-size: 12px; display: flex; align-items: center; justify-content: center; border: 2px solid white; }
.bubble-enter-active, .bubble-leave-active { transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); transform-origin: bottom right; }
.bubble-enter-from, .bubble-leave-to { opacity: 0; transform: scale(0.5) translateY(20px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>