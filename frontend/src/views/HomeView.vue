<template>
  <div class="home-wrapper">
    <section id="inicio" class="hero-premium">
      <div class="hero-content">
        <h1>Smith Tailor</h1>
        <p>Costura • Confección • Reparación</p>
      </div>
    </section>

    <section id="confecciones" class="category-section">
      <div class="section-header">
        <h2>✨ Confecciones</h2>
        <p>Diseños exclusivos hechos a medida</p>
      </div>
      <div class="carousel-container">
        <div class="carousel-track">
          <div v-for="p in filtrados('Confección')" :key="p._id" class="carousel-item">
            <img :src="p.imagenUrl" :alt="p.nombre">
            <div class="carousel-info">
              <h4>{{ p.nombre }}</h4>
              <button @click="agregarAlCarrito(p)" class="btn-add-mini">+ Agregar</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="reparaciones" class="category-section bg-light">
      <div class="section-header">
        <h2>🧵 Reparaciones & Arreglos</h2>
        <p>Reparamos y ajustamos tus prendas con acabado profesional</p>
      </div>
      <div class="interactive-grid">
        <div v-for="p in filtrados('Arreglo')" :key="p._id" class="grid-card">
          <div class="card-img">
            <img :src="p.imagenUrl" :alt="p.nombre">
            <div class="overlay">
              <button @click="agregarAlCarrito(p)">Añadir al Pedido</button>
            </div>
          </div>
          <div class="card-body">
            <h3>{{ p.nombre }}</h3>
            <p class="price">${{ p.precio.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="comentarios" class="comments-section">
      <div class="section-header">
        <h2>💬 Lo que dicen nuestros clientes</h2>
      </div>
      <div class="comments-grid">
        <div class="comment-card">
          <p>"Excelente atención y prolijidad en el arreglo de mi campera. ¡Quedó como nueva!"</p>
          <span>- María G.</span>
        </div>
        <div class="comment-card">
          <p>"Me confeccionaron un pantalón a medida y el calce es perfecto. Muy recomendados."</p>
          <span>- Juan P.</span>
        </div>
        <div class="comment-card">
          <p>"Rápido y con muy buen precio. La ubicación en Luján es muy cómoda."</p>
          <span>- Ana L.</span>
        </div>
      </div>
    </section>

    <section id="contacto" class="contact-section">
      <div class="contact-grid">
        <div class="info-box">
          <h3>📍 Ubicación en Luján</h3>
          <p class="address-text">Dr. Muñiz 402, B6700 Luján, Buenos Aires</p>
          <div class="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.066427320473!2d-59.1235174!3d-34.5771569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc7e79393a5477%3A0x633d9c742337777!2sDr.%20Mu%C3%B1iz%20402%2C%20B6700%20Luj%C3%A1n%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1700000000000" 
              width="100%" height="250" style="border:0; border-radius: 15px;" allowfullscreen="" loading="lazy">
            </iframe>
          </div>
        </div>
        <div class="social-box">
          <h3>📱 Contacto Directo</h3>
          <div class="social-buttons">
            <a href="https://www.instagram.com/taller_confecciones.smith" target="_blank" class="btn-ig">Instagram</a>
            <a href="https://wa.me/5491168915378" target="_blank" class="btn-wa">WhatsApp</a>
          </div>
        </div>
      </div>
    </section>

    <div class="cart-floating" v-if="carrito.length > 0">
      <div class="cart-icon" @click="showCart = !showCart">
        🛒 <span class="badge">{{ totalItems }}</span>
      </div>
      <div class="cart-panel" v-if="showCart">
        <div class="cart-header">
          <h4>Tu Pedido</h4>
          <button @click="showCart = false" class="btn-close">×</button>
        </div>
        <div class="cart-list">
          <div v-for="item in carrito" :key="item._id" class="cart-item">
            <div class="item-info">
              <span class="item-name">{{ item.nombre }}</span>
              <span class="item-price">${{ (item.precio * item.cantidad).toLocaleString() }}</span>
            </div>
            <div class="item-controls">
              <button @click="modificarCantidad(item, -1)" class="btn-qty">-</button>
              <span class="qty-number">{{ item.cantidad }}</span>
              <button @click="modificarCantidad(item, 1)" class="btn-qty">+</button>
              <button @click="quitarDelCarrito(item._id)" class="btn-remove">✕</button>
            </div>
          </div>
        </div>
        <div class="cart-footer">
          <div class="total-row">
            <span>Total estimado:</span>
            <strong>${{ totalPrecio.toLocaleString() }}</strong>
          </div>
          <button @click="enviarWhatsApp" class="btn-send-wa">Consultar por WhatsApp</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const prendas = ref([]);
const carrito = ref([]);
const showCart = ref(false);

const obtenerProductos = async () => {
  try {
    const res = await axios.get('https://api-taller-costura.onrender.com/api/prendas');
    prendas.value = res.data;
  } catch (error) {
    console.error("Error cargando productos", error);
  }
};

const filtrados = (cat) => prendas.value.filter(p => p.categoria === cat);

// Lógica del Carrito
const agregarAlCarrito = (producto) => {
  const existe = carrito.value.find(item => item._id === producto._id);
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.value.push({ ...producto, cantidad: 1 });
  }
  showCart.value = true;
};

const modificarCantidad = (item, cambio) => {
  item.cantidad += cambio;
  if (item.cantidad < 1) {
    quitarDelCarrito(item._id);
  }
};

const quitarDelCarrito = (id) => {
  carrito.value = carrito.value.filter(item => item._id !== id);
};

const totalItems = computed(() => {
  return carrito.value.reduce((acc, item) => acc + item.cantidad, 0);
});

const totalPrecio = computed(() => {
  return carrito.value.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
});

const enviarWhatsApp = () => {
  const numeroWhatsApp = "5491168915378"; 
  const lista = carrito.value.map(p => `${p.cantidad}x ${p.nombre} ($${(p.precio * p.cantidad).toLocaleString()})`).join('\n');
  const texto = `¡Hola Smith Tailor! Me gustaría consultar por este pedido:\n\n${lista}\n\nTotal estimado: $${totalPrecio.value.toLocaleString()}`;
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
};

onMounted(obtenerProductos);
</script>

<style scoped>
.home-wrapper { background: #f8fbfb; font-family: 'Inter', sans-serif; }

/* HERO */
.hero-premium {
  height: 45vh;
  background: linear-gradient(rgba(0,77,77,0.8), rgba(0,77,77,0.8)), url('https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?q=80&w=2070');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}
.hero-content h1 { font-size: 3.5rem; margin-bottom: 5px; }

/* SECCIONES */
.category-section { padding: 60px 5%; }
.bg-light { background: #eff6f6; }
.section-header h2 { color: #004d4d; font-size: 2.2rem; }

/* CARRUSEL & GRID */
.carousel-container { overflow-x: auto; padding-bottom: 20px; }
.carousel-track { display: flex; gap: 20px; }
.carousel-item { min-width: 280px; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
.carousel-item img { width: 100%; height: 350px; object-fit: cover; }
.carousel-info { padding: 15px; display: flex; justify-content: space-between; align-items: center; }
.btn-add-mini { background: #004d4d; color: white; border: none; padding: 6px 12px; border-radius: 20px; cursor: pointer; }

.interactive-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
.grid-card { background: white; border-radius: 15px; overflow: hidden; position: relative; transition: 0.3s; }
.card-img { height: 300px; position: relative; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,77,77,0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
.grid-card:hover .overlay { opacity: 1; }
.overlay button { background: white; color: #004d4d; border: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer; }

/* COMENTARIOS */
.comments-section { padding: 60px 5%; background: #fff; }
.comments-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; }
.comment-card { background: #f8fbfb; padding: 25px; border-radius: 15px; border-left: 5px solid #004d4d; }
.comment-card p { font-style: italic; color: #555; }
.comment-card span { display: block; margin-top: 10px; font-weight: bold; color: #004d4d; }

/* CONTACTO */
.contact-section { padding: 60px 5%; background: #eff6f6; }
.contact-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px; }
.social-buttons { display: flex; flex-direction: column; gap: 10px; }
.btn-ig, .btn-wa { padding: 15px; border-radius: 10px; text-align: center; text-decoration: none; color: white; font-weight: bold; }
.btn-ig { background: linear-gradient(45deg, #f09433, #bc1888); }
.btn-wa { background: #25d366; }

/* CARRITO FLOTANTE */
.cart-floating { position: fixed; bottom: 30px; right: 30px; z-index: 2000; }
.cart-icon { background: #004d4d; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; position: relative; box-shadow: 0 8px 25px rgba(0,77,77,0.3); }
.badge { position: absolute; top: -5px; right: -5px; background: #e74c3c; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; border: 2px solid white; }

.cart-panel { position: absolute; bottom: 75px; right: 0; width: 320px; background: white; border-radius: 20px; padding: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: 1px solid #eef5f5; }
.cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #f0f5f5; padding-bottom: 10px; }
.btn-close { background: none; border: none; font-size: 1.5rem; color: #ccc; cursor: pointer; }

.cart-list { max-height: 250px; overflow-y: auto; margin-bottom: 15px; }
.cart-item { display: flex; flex-direction: column; padding: 10px 0; border-bottom: 1px solid #fafafa; }
.item-info { display: flex; justify-content: space-between; margin-bottom: 8px; }
.item-name { font-weight: 600; font-size: 0.95rem; color: #333; }
.item-price { color: #004d4d; font-weight: 700; }

.item-controls { display: flex; align-items: center; gap: 10px; }
.btn-qty { background: #f0f5f5; border: none; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; font-weight: bold; color: #004d4d; transition: 0.2s; }
.btn-qty:hover { background: #004d4d; color: white; }
.qty-number { font-weight: 700; min-width: 20px; text-align: center; }
.btn-remove { background: none; border: none; color: #ff4d4d; cursor: pointer; margin-left: auto; font-size: 1.1rem; }

.cart-footer { border-top: 1px solid #f0f5f5; padding-top: 15px; }
.total-row { display: flex; justify-content: space-between; font-size: 1.1rem; margin-bottom: 15px; }
.btn-send-wa { width: 100%; background: #25d366; color: white; border: none; padding: 14px; border-radius: 12px; cursor: pointer; font-weight: bold; font-size: 1rem; box-shadow: 0 4px 12px rgba(37,211,102,0.2); }
</style>