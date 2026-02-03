<template>
  <div class="home-wrapper">
    <header id="inicio" class="hero-premium">
      <div class="hero-content">
        <h1>Smith Teilor</h1>
        <p>Costura • Confección • Reparación</p>
      </div>
    </header>

    <main class="container">
      <section id="confecciones" class="category-section">
        <div class="section-header">
          <h2>✨ Confecciones</h2>
          <p>Diseños exclusivos hechos a medida</p>
        </div>
        <div class="interactive-grid">
          <div v-for="p in filtrados('Confección')" :key="p._id" class="grid-card">
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

      <section id="reparaciones" class="category-section bg-light-section">
        <div class="section-header">
          <h2>🧵 Reparaciones & Arreglos</h2>
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
            <p>"Excelente atención y prolijidad. ¡Mi campera quedó como nueva!"</p>
            <span class="author">- María G.</span>
          </div>
          <div class="comment-card">
            <p>"El pantalón a medida quedó perfecto. Muy recomendados por su puntualidad."</p>
            <span class="author">- Juan P.</span>
          </div>
        </div>
      </section>

      <section id="contacto" class="contact-section bg-light-section">
        <div class="contact-grid">
          <div class="info-box">
            <h3>📍 Ubicación en Luján</h3>
            <p>Dr. Muñiz 402, Luján, Buenos Aires</p>
            <div class="map-wrapper">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.0617373752044!2d-59.1234567!3d-34.5678901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc7e77b79a5f4b%3A0x6b8f365027c6999b!2sDr.%20Mu%C3%B1iz%20402%2C%20B6700%20Luj%C3%A1n%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar" 
                width="100%" height="350" style="border:0;" allowfullscreen="" loading="lazy">
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
    </main>

    <div class="cart-floating" ref="cartContainer" v-if="carrito.length > 0">
      <div class="cart-icon" @click.stop="showCart = !showCart">
        🛒 <span class="badge">{{ totalItems }}</span>
      </div>
      
      <div class="cart-panel" v-if="showCart">
        <div class="cart-header">
          <h4>Tu Pedido</h4>
          <button @click="showCart = false" class="btn-minimize">_</button>
        </div>

        <div class="cart-list">
          <div v-for="item in carrito" :key="item._id" class="cart-item">
            <div class="item-info">
              <span class="item-name">{{ item.nombre }}</span>
              <span class="item-price">${{ (item.precio * item.cantidad).toLocaleString() }}</span>
            </div>
            <div class="item-actions">
              <div class="qty-selector">
                <button @click="modificarCantidad(item, -1)">-</button>
                <span class="qty-number">{{ item.cantidad }}</span>
                <button @click="modificarCantidad(item, 1)">+</button>
              </div>
              <button @click="quitarProducto(item._id)" class="btn-del">Eliminar</button>
            </div>
          </div>
        </div>

        <div class="cart-footer">
          <div class="total-display">
            <span>Total:</span>
            <strong>${{ totalPrecio.toLocaleString() }}</strong>
          </div>
          <button @click="vaciarCarrito" class="btn-clear">Cancelar Pedido</button>
          <button @click="enviarWhatsApp" class="btn-order">Enviar a WhatsApp</button>
        </div>
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
const cartContainer = ref(null);

const obtenerProductos = async () => {
  try {
    const res = await axios.get('https://api-taller-costura.onrender.com/api/prendas');
    prendas.value = res.data;
  } catch (e) { console.error(e); }
};

const handleOutsideClick = (e) => {
  if (showCart.value && cartContainer.value && !cartContainer.value.contains(e.target)) {
    showCart.value = false;
  }
};

const filtrados = (cat) => prendas.value.filter(p => p.categoria === cat);
const agregarAlCarrito = (p) => {
  const existe = carrito.value.find(i => i._id === p._id);
  if (existe) existe.cantidad++;
  else carrito.value.push({ ...p, cantidad: 1 });
  showCart.value = true;
};
const modificarCantidad = (item, n) => {
  item.cantidad += n;
  if (item.cantidad < 1) quitarProducto(item._id);
};
const quitarProducto = (id) => { carrito.value = carrito.value.filter(i => i._id !== id); };
const vaciarCarrito = () => { if (confirm("¿Vaciar pedido?")) { carrito.value = []; showCart.value = false; } };
const totalItems = computed(() => carrito.value.reduce((acc, i) => acc + i.cantidad, 0));
const totalPrecio = computed(() => carrito.value.reduce((acc, i) => acc + (i.precio * i.cantidad), 0));
const enviarWhatsApp = () => {
  const lista = carrito.value.map(p => `- ${p.cantidad}x ${p.nombre} ($${(p.precio * p.cantidad).toLocaleString()})`).join('\n');
  const msj = `¡Hola Smith Tailor! Mi pedido:\n${lista}\n\n*Total: $${totalPrecio.value.toLocaleString()}*`;
  window.open(`https://wa.me/5491168915378?text=${encodeURIComponent(msj)}`, '_blank');
};

onMounted(() => { obtenerProductos(); window.addEventListener('click', handleOutsideClick); });
onUnmounted(() => window.removeEventListener('click', handleOutsideClick));
</script>

<style scoped>
.hero-premium { height: 35vh; background: #004d4d; color: white; display: flex; align-items: center; justify-content: center; text-align: center; }
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.category-section { padding: 40px 0; }
.bg-light-section { background: #eff6f6; width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; padding: 40px 20px; }
.section-header { text-align: center; margin-bottom: 30px; }

/* GRID */
.interactive-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
.grid-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.card-img { height: 250px; position: relative; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.overlay { position: absolute; inset: 0; background: rgba(0,77,77,0.7); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
.card-img:hover .overlay { opacity: 1; }
.overlay button { background: white; color: #004d4d; border: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer; }
.card-body { padding: 15px; text-align: center; }
.price { color: #004d4d; font-weight: bold; }

/* COMENTARIOS */
.comments-section { padding: 60px 0; }
.comments-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
.comment-card { background: white; padding: 25px; border-radius: 15px; border-left: 5px solid #004d4d; box-shadow: 0 3px 10px rgba(0,0,0,0.05); }
.author { display: block; margin-top: 15px; font-weight: bold; color: #004d4d; }

/* CONTACTO Y REDES */
.contact-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; max-width: 1200px; margin: 0 auto; }
.map-wrapper { border-radius: 15px; overflow: hidden; border: 1px solid #ddd; margin-top: 10px; }
.social-buttons { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
.social-buttons a { display: block; padding: 15px; border-radius: 10px; color: white; text-decoration: none; text-align: center; font-weight: bold; transition: 0.3s; }
.btn-ig { background: linear-gradient(45deg, #f09433, #bc1888); }
.btn-wa { background: #25d366; }
.social-buttons a:hover { transform: scale(1.02); filter: brightness(1.1); }

/* CARRITO PULIDO */
.cart-floating { position: fixed; bottom: 25px; right: 25px; z-index: 2000; }
.cart-icon { background: #004d4d; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
.badge { position: absolute; top: 0; right: 0; background: #ff4d4d; color: white; padding: 3px 8px; border-radius: 50%; font-size: 0.75rem; }
.cart-panel { position: absolute; bottom: 75px; right: 0; width: 320px; background: white; border-radius: 15px; padding: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
.cart-header { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.cart-item { margin-bottom: 15px; border-bottom: 1px solid #f9f9f9; padding-bottom: 10px; }
.item-info { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 8px; gap: 15px; } /* Gap añadido para que no se pegue el texto al precio */
.item-actions { display: flex; justify-content: space-between; align-items: center; }
.qty-selector { display: flex; align-items: center; gap: 10px; background: #f0f7f7; padding: 5px 12px; border-radius: 8px; }
.qty-selector button { background: none; border: none; font-weight: bold; color: #004d4d; cursor: pointer; font-size: 1rem; }
.btn-del { color: #ff4d4d; border: none; background: none; font-size: 0.8rem; text-decoration: underline; cursor: pointer; }
.cart-footer { border-top: 2px solid #eee; padding-top: 15px; }
.total-display { display: flex; justify-content: space-between; font-size: 1.2rem; margin-bottom: 15px; }
.btn-order { width: 100%; background: #25d366; color: white; border: none; padding: 14px; border-radius: 10px; font-weight: bold; cursor: pointer; }
.btn-clear { width: 100%; background: none; border: 1px solid #ff4d4d; color: #ff4d4d; padding: 8px; border-radius: 10px; margin-bottom: 10px; cursor: pointer; }

@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } .cart-panel { width: 290px; right: -10px; } }
</style>