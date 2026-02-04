<template>
<div class="admin-page-wrapper">
    <div class="admin-container">
      <div class="top-admin-nav">
        <button @click="logout" class="btn-logout">Cerrar Sesión 🔒</button>
      </div>
      
      <h1 class="admin-title">Panel de Control - Smith Teilor</h1>

      <div class="admin-card">
        <h3 class="card-subtitle">
          {{ editandoId ? '📝 Editando Producto' : '🆕 Agregar Nuevo Producto' }}
        </h3>
        
        <div class="admin-form-grid">
          <div class="form-group">
            <label>Nombre del Producto</label>
            <input v-model="nuevo.nombre" placeholder="Ej: Vestido de Gala" class="custom-input" />
          </div>
          <div class="form-group">
            <label>Precio ($)</label>
            <input type="number" v-model="nuevo.precio" placeholder="0" class="custom-input" />
          </div>
          <div class="form-group full-width">
            <label>Categoría</label>
            <select v-model="nuevo.categoria" class="custom-select">
              <option value="Confección">Confección</option>
              <option value="Arreglo">Arreglo</option>
              <option value="Nuestro Trabajo">Nuestro Trabajo (Carrusel)</option>
            </select>
          </div>
          
          <div class="form-group full-width">
            <label>Imagen del Producto</label>
            <div 
              class="st-drop-zone" 
              :class="{ 'drop-active': isDragging, 'is-loading': isUploading }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <div v-if="isUploading" class="upload-status">
                <div class="spinner"></div>
                <p>Subiendo imagen a Cloudinary...</p>
              </div>

              <div v-else-if="!nuevo.imagenUrl" class="drop-placeholder">
                <div class="icon-box">📂</div>
                <button type="button" class="st-btn-search" @click="$refs.fileInput.click()">
                  Buscar en mi PC
                </button>
                <p class="drop-text">o arrastra tu archivo aquí</p>
                <input type="file" ref="fileInput" @change="handleFileSelect" hidden accept="image/*" />
              </div>

              <div v-else class="preview-container">
                <img :src="nuevo.imagenUrl" class="drop-preview" />
                <button @click="nuevo.imagenUrl = ''" class="btn-remove-img">🗑️ Quitar y cambiar imagen</button>
              </div>
            </div>
            <input v-model="nuevo.imagenUrl" placeholder="La URL se generará automáticamente" class="custom-input mt-10 url-readonly" readonly />
          </div>
        </div>

        <div class="form-actions">
          <button @click="guardarProducto" class="btn-publish" :disabled="isUploading">
            {{ editandoId ? 'Actualizar Producto' : 'Publicar Producto' }}
          </button>
          <button v-if="editandoId" @click="cancelarEdicion" class="btn-cancel">Cancelar</button>
        </div>
      </div>

      <div class="admin-card">
        <h3 class="card-subtitle">📦 Productos Existentes</h3>
        <div class="table-responsive">
          <table class="products-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in productos" :key="p._id" class="product-row">
                <td data-label="Imagen"><img :src="p.imagenUrl" class="img-preview" @error="handleImgError" /></td>
                <td data-label="Nombre"><span class="product-name">{{ p.nombre }}</span></td>
                <td data-label="Categoría"><span class="badge">{{ p.categoria }}</span></td>
                <td data-label="Precio"><span class="product-price">${{ p.precio.toLocaleString() }}</span></td>
                <td class="actions-cell">
                  <button @click="cargarEdicion(p)" class="btn-edit" title="Editar">✏️</button>
                  <button @click="eliminar(p._id)" class="btn-delete" title="Eliminar">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const productos = ref([]);
const isDragging = ref(false);
const isUploading = ref(false);
const editandoId = ref(null);
const nuevo = ref({ nombre: '', precio: 0, categoria: 'Confección', imagenUrl: '' });
const fileInput = ref(null);

const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';

// --- CONFIGURACIÓN CLOUDINARY ---
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dg1kg7aya/image/upload';
const UPLOAD_PRESET = 'taller-smith';

const obtener = async () => {
try {
    const res = await axios.get(API_URL);
    productos.value = res.data;
} catch (e) { console.error("Error al obtener productos", e); }
};

const handleDrop = (e) => {
isDragging.value = false;
const file = e.dataTransfer.files[0];
if (file) subirImagen(file);
};

const handleFileSelect = (e) => {
const file = e.target.files[0];
if (file) subirImagen(file);
};

const subirImagen = async (file) => {
isUploading.value = true;
const formData = new FormData();
formData.append('file', file);
formData.append('upload_preset', UPLOAD_PRESET);

try {
    const res = await axios.post(CLOUDINARY_URL, formData);
    nuevo.value.imagenUrl = res.data.secure_url;
} catch (err) {
    console.error("Error Cloudinary:", err);
    alert("¡Atención! Cloudinary rechazó la imagen. Asegúrate de que el 'Upload Preset' llamado 'taller-smith' sea de tipo 'Unsigned' en la configuración de Cloudinary.");
} finally {
    isUploading.value = false;
}
};

const guardarProducto = async () => {
if(!nuevo.value.nombre || !nuevo.value.imagenUrl) return alert("Completa los campos");

  // Creamos una copia limpia para enviar
const productoData = {
    nombre: nuevo.value.nombre,
    precio: Number(nuevo.value.precio), // Forzamos a que sea un número
    categoria: nuevo.value.categoria,
    imagenUrl: nuevo.value.imagenUrl
};
try {
    if (editandoId.value) {
    await axios.put(`${API_URL}/${editandoId.value}`, productoData);
    } else {
    await axios.post(API_URL, productoData);
    }
    cancelarEdicion();
    obtener();
    alert("¡Éxito al publicar!");
} catch (error) {
    console.error("Error detallado:", error.response?.data); // Esto te dirá EXACTAMENTE qué campo falla
    alert("Error al conectar con el servidor. Revisa la consola.");
}
};

const cargarEdicion = (p) => {
editandoId.value = p._id;
nuevo.value = { ...p };
window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelarEdicion = () => {
editandoId.value = null;
nuevo.value = { nombre: '', precio: 0, categoria: 'Confección', imagenUrl: '' };
};

const eliminar = async (id) => {
if(confirm("¿Eliminar este producto definitivamente?")) {
    await axios.delete(`${API_URL}/${id}`);
    obtener();
}
};

const logout = () => {
localStorage.removeItem('isLogged');
router.push('/login');
};

const handleImgError = (e) => { e.target.src = 'https://via.placeholder.com/55x55?text=Error'; };

onMounted(obtener);
</script>

<style scoped>
.admin-page-wrapper { padding: 120px 0 80px; min-height: 100vh; background-color: #f4f7f7; font-family: 'Inter', sans-serif; }
.admin-container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
.top-admin-nav { display: flex; justify-content: flex-end; margin-bottom: 20px; }
.btn-logout { background: white; border: 2px solid #ff4d4d; color: #ff4d4d; padding: 8px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }
.btn-logout:hover { background: #ff4d4d; color: white; }

.admin-title { color: #004d4d; font-size: 2.2rem; text-align: center; margin-bottom: 40px; font-weight: 800; }
.admin-card { background: white; border-radius: 24px; padding: 35px; box-shadow: 0 12px 40px rgba(0,0,0,0.06); margin-bottom: 40px; }
.card-subtitle { margin-bottom: 25px; color: #334155; font-size: 1.3rem; }

.admin-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
.full-width { grid-column: span 2; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-weight: 600; color: #64748b; font-size: 0.9rem; }

.custom-input, .custom-select { width: 100%; padding: 14px; border-radius: 12px; border: 2px solid #edf2f2; font-size: 1rem; outline: none; transition: 0.3s; }
.custom-input:focus { border-color: #004d4d; }
.url-readonly { background: #f8fafc; color: #94a3b8; font-size: 0.8rem; cursor: not-allowed; }

/* NUEVA DROP ZONE ESTILO ARCHIVO */
.st-drop-zone {
border: 2px dashed #cbd5e0;
border-radius: 20px;
padding: 40px;
text-align: center;
  background: #f0f7ff; /* Azul suave tipo archivo */
transition: all 0.3s ease;
position: relative;
min-height: 200px;
display: flex;
align-items: center;
justify-content: center;
}

.drop-active {
border-color: #004d4d;
background: #e6fffa;
transform: scale(1.02);
}

.icon-box { font-size: 3rem; margin-bottom: 10px; }

.st-btn-search {
background: #004d4d;
color: white;
border: none;
padding: 12px 24px;
border-radius: 50px;
font-weight: 700;
cursor: pointer;
margin-bottom: 10px;
box-shadow: 0 4px 12px rgba(0, 77, 77, 0.2);
transition: 0.3s;
}

.st-btn-search:hover {
background: #006666;
transform: translateY(-2px);
}

.drop-text { color: #64748b; font-size: 0.9rem; }

.upload-status { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.spinner { width: 30px; height: 30px; border: 4px solid #f3f3f3; border-top: 4px solid #004d4d; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.drop-preview { max-height: 180px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.btn-remove-img { color: #ef4444; border: none; background: #fee2e2; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.8rem; }

/* BOTONES ACCIÓN */
.form-actions { display: flex; gap: 15px; margin-top: 30px; }
.btn-publish { flex: 2; background: #004d4d; color: white; border: none; padding: 18px; border-radius: 14px; font-weight: 800; cursor: pointer; font-size: 1rem; transition: 0.3s; }
.btn-publish:hover:not(:disabled) { background: #003333; }
.btn-publish:disabled { background: #cbd5e0; cursor: not-allowed; }
.btn-cancel { flex: 1; background: #f1f5f9; color: #64748b; border: none; border-radius: 14px; cursor: pointer; font-weight: 600; }

/* TABLA */
.table-responsive { overflow-x: auto; }
.products-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
.product-row td { padding: 15px; background: #fff; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
.img-preview { width: 55px; height: 55px; object-fit: cover; border-radius: 10px; }
.product-price { font-weight: 800; color: #2ecc71; }
.badge { background: #e6fffa; color: #004d4d; padding: 6px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 700; }
.actions-cell { display: flex; gap: 10px; }
.btn-edit, .btn-delete { border: none; background: #f1f5f9; padding: 10px; border-radius: 10px; cursor: pointer; transition: 0.2s; }
.btn-edit:hover { background: #e2e8f0; }
.btn-delete:hover { background: #fee2e2; }

@media (max-width: 768px) {
.admin-form-grid { grid-template-columns: 1fr; }
.full-width { grid-column: span 1; }
.st-drop-zone { padding: 20px; }
}
</style>