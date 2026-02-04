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
              class="drop-zone" 
              :class="{ 'drop-active': isDragging, 'is-loading': isUploading }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <div v-if="isUploading" class="upload-status">
                <p>⏳ Subiendo imagen a Cloudinary...</p>
              </div>
              <div v-else-if="!nuevo.imagenUrl">
                <p>Arrastra una foto aquí o</p>
                <label class="btn-search-file">
                  Buscar en mi PC
                  <input type="file" @change="handleFileSelect" hidden accept="image/*" />
                </label>
              </div>
              <div v-else class="preview-container">
                <img :src="nuevo.imagenUrl" class="drop-preview" />
                <button @click="nuevo.imagenUrl = ''" class="btn-remove-img">Cambiar imagen</button>
              </div>
            </div>
            <input v-model="nuevo.imagenUrl" placeholder="URL de Cloudinary (se genera sola al subir)" class="custom-input mt-10" readonly />
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

const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';

// --- CONFIGURACIÓN CLOUDINARY ---
// Reemplaza 'tu_cloud_name' por tu Cloud Name de Cloudinary
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dg1kg7aya/image/upload';
// Reemplaza 'tu_preset' por tu Upload Preset (debe ser Unsigned)
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
    alert("Error al subir la imagen. Revisa tu cloud_name y preset.");
  } finally {
    isUploading.value = false;
  }
};

const guardarProducto = async () => {
  if(!nuevo.value.nombre || !nuevo.value.imagenUrl) return alert("Completa los campos");
  try {
    if (editandoId.value) {
      await axios.put(`${API_URL}/${editandoId.value}`, nuevo.value);
    } else {
      await axios.post(API_URL, nuevo.value);
    }
    cancelarEdicion();
    obtener();
    alert("¡Éxito!");
  } catch (error) { alert("Error al conectar con Render/Mongo"); }
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
  if(confirm("¿Eliminar este producto?")) {
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
.admin-page-wrapper { padding: 120px 0 80px; min-height: 100vh; background-color: #f4f7f7; font-family: sans-serif; }
.admin-container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
.top-admin-nav { display: flex; justify-content: flex-end; margin-bottom: 20px; }
.btn-logout { background: white; border: 2px solid #ff4d4d; color: #ff4d4d; padding: 8px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; }
.admin-title { color: #004d4d; font-size: 2.2rem; text-align: center; margin-bottom: 40px; }
.admin-card { background: white; border-radius: 24px; padding: 35px; box-shadow: 0 12px 40px rgba(0,0,0,0.06); margin-bottom: 40px; }
.admin-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
.full-width { grid-column: span 2; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.custom-input, .custom-select { width: 100%; padding: 14px; border-radius: 12px; border: 2px solid #edf2f2; }
.drop-zone { border: 2px dashed #cbd5e0; border-radius: 16px; padding: 40px; text-align: center; background: #f8fafc; transition: 0.3s; }
.drop-active { border-color: #004d4d; background: #e6fffa; }
.is-loading { opacity: 0.6; pointer-events: none; }
.drop-preview { max-height: 180px; border-radius: 12px; margin-bottom: 10px; }
.btn-remove-img { display: block; margin: 0 auto; color: #ff4d4d; border: none; background: none; cursor: pointer; }
.form-actions { display: flex; gap: 15px; margin-top: 30px; }
.btn-publish { flex: 2; background: #004d4d; color: white; border: none; padding: 16px; border-radius: 14px; font-weight: 800; cursor: pointer; }
.btn-publish:disabled { background: #ccc; }
.btn-cancel { flex: 1; background: #f1f5f9; color: #64748b; border: none; border-radius: 14px; cursor: pointer; }
.table-responsive { overflow-x: auto; }
.products-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
.product-row td { padding: 15px; background: #fff; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
.img-preview { width: 55px; height: 55px; object-fit: cover; border-radius: 10px; }
.product-price { font-weight: 800; color: #25d366; }
.badge { background: #e6fffa; color: #004d4d; padding: 6px 12px; border-radius: 10px; font-size: 0.75rem; }
.actions-cell { display: flex; gap: 10px; }
.btn-edit, .btn-delete { border: none; background: #f1f5f9; padding: 8px; border-radius: 8px; cursor: pointer; }
.mt-10 { margin-top: 10px; }

@media (max-width: 768px) {
  .admin-form-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: span 1; }
  .product-row td { display: flex; justify-content: space-between; align-items: center; }
}
</style>