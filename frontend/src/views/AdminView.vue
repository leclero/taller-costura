<template>
<div class="admin-page-wrapper">
    <div class="admin-container">
      <div class="top-admin-nav">
        <span class="user-welcome">Bienvenido, <b>{{ nombreUsuarioActual }}</b> ({{ rolActual }})</span>
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
                <td data-label="Nombre"><b>{{ p.nombre }}</b></td>
                <td data-label="Categoría"><span class="badge">{{ p.categoria }}</span></td>
                <td data-label="Precio"><span class="product-price">${{ p.precio.toLocaleString() }}</span></td>
                <td class="actions-cell">
                  <button @click="cargarEdicion(p)" class="btn-edit">✏️</button>
                  <button @click="eliminar(p._id)" class="btn-delete">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="admin-card config-card">
        <h3 class="card-subtitle">🔐 Mis Datos de Acceso</h3>
        <p class="helper-text">Solo tú puedes modificar tu usuario y contraseña.</p>
        
        <div class="admin-form-grid">
          <div class="form-group">
            <label>Mi Usuario</label>
            <input v-model="config.nuevoUsuario" class="custom-input" />
          </div>
          <div class="form-group">
            <label>Nueva Contraseña</label>
            <div class="password-wrapper">
              <input 
                :type="showPass ? 'text' : 'password'" 
                v-model="config.nuevaPass" 
                placeholder="Escribe para cambiar" 
                class="custom-input" 
              />
              <button @click="showPass = !showPass" class="btn-eye">
                {{ showPass ? '👁️' : '🙈' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button @click="actualizarMiPerfil" class="btn-save-config">Guardar mis cambios</button>
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

// LÓGICA DE USUARIO LOGUEADO
const nombreUsuarioActual = ref(localStorage.getItem('userName'));
const rolActual = ref(localStorage.getItem('userRol'));
const config = ref({ nuevoUsuario: localStorage.getItem('userName') || '', nuevaPass: '' });
const showPass = ref(false);

const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';
const AUTH_URL = 'https://api-taller-costura.onrender.com/api/auth/update-profile';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dg1kg7aya/image/upload';
const UPLOAD_PRESET = 'taller-smith';

const obtener = async () => {
  try {
    const res = await axios.get(API_URL);
    productos.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) { console.error(e); }
};

const actualizarMiPerfil = async () => {
  const myId = localStorage.getItem('userId');
  if (!config.value.nuevoUsuario || !config.value.nuevaPass) {
    return alert("Por favor completa ambos campos.");
  }
  try {
    const res = await axios.put(`${AUTH_URL}/${myId}`, {
      nuevoUsuario: config.value.nuevoUsuario,
      nuevaPass: config.value.nuevaPass,
      solicitanteId: myId
    });
    alert(res.data.message);
    localStorage.setItem('userName', config.value.nuevoUsuario);
    nombreUsuarioActual.value = config.value.nuevoUsuario;
    config.value.nuevaPass = '';
  } catch (error) {
    alert(error.response?.data?.error || "Error al actualizar");
  }
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
  } catch (err) { alert("Error al subir imagen"); }
  finally { isUploading.value = false; }
};

const guardarProducto = async () => {
  if(!nuevo.value.nombre || !nuevo.value.imagenUrl) return alert("Completa los datos");
  const productoFinal = { ...nuevo.value, precio: Number(nuevo.value.precio) };
  try {
    if (editandoId.value) await axios.put(`${API_URL}/${editandoId.value}`, productoFinal);
    else await axios.post(API_URL, productoFinal);
    alert("¡Éxito!");
    cancelarEdicion();
    obtener();
  } catch (error) { alert("Error al guardar"); }
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
  if(confirm("¿Eliminar?")) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      obtener();
    } catch (e) { alert("Error"); }
  }
};

const logout = () => {
  localStorage.clear();
  router.push('/login');
};

const handleImgError = (e) => { e.target.style.display = 'none'; };
onMounted(obtener);
</script>

<style scoped>
/* Estilos mantenidos y mejorados */
.admin-page-wrapper { padding: 120px 0 80px; min-height: 100vh; background-color: #f4f7f7; font-family: 'Inter', sans-serif; }
.admin-container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
.top-admin-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: white; padding: 15px 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.user-welcome { color: #444; font-size: 0.9rem; }
.btn-logout { background: white; border: 2px solid #ff4d4d; color: #ff4d4d; padding: 8px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }
.btn-logout:hover { background: #ff4d4d; color: white; }
.admin-title { color: #004d4d; font-size: 2.2rem; text-align: center; margin-bottom: 40px; font-weight: 800; }
.admin-card { background: white; border-radius: 24px; padding: 35px; box-shadow: 0 12px 40px rgba(0,0,0,0.06); margin-bottom: 40px; }
.card-subtitle { margin-bottom: 25px; color: #334155; font-size: 1.3rem; }
.admin-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
.full-width { grid-column: span 2; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.custom-input, .custom-select { width: 100%; padding: 14px; border-radius: 12px; border: 2px solid #edf2f2; font-size: 1rem; outline: none; box-sizing: border-box; }
.password-wrapper { position: relative; display: flex; align-items: center; }
.btn-eye { position: absolute; right: 15px; background: none; border: none; cursor: pointer; font-size: 1.2rem; }
.config-card { border-top: 5px solid #2ecc71; }
.btn-save-config { background: #2ecc71; color: white; border: none; padding: 16px 30px; border-radius: 14px; font-weight: 800; cursor: pointer; width: 100%; }
.form-actions { display: flex; gap: 15px; margin-top: 30px; }
.btn-publish { flex: 2; background: #004d4d; color: white; border: none; padding: 18px; border-radius: 14px; font-weight: 800; cursor: pointer; }
.st-drop-zone { border: 2px dashed #cbd5e0; border-radius: 20px; padding: 40px; text-align: center; background: #f0f7ff; min-height: 200px; display: flex; align-items: center; justify-content: center; }
.img-preview { width: 55px; height: 55px; object-fit: cover; border-radius: 10px; }
.badge { background: #e6fffa; color: #004d4d; padding: 6px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 700; }
@media (max-width: 768px) { .admin-form-grid { grid-template-columns: 1fr; } .full-width { grid-column: span 1; } }
</style>