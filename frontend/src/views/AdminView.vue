<template>
  <div class="admin-page-wrapper">
    <div class="admin-container">
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
              :class="{ 'drop-active': isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <div v-if="!nuevo.imagenUrl">
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
            <input v-model="nuevo.imagenUrl" placeholder="O pega la URL de la imagen aquí directamente" class="custom-input mt-10" />
          </div>
        </div>

        <div class="form-actions">
          <button @click="guardarProducto" class="btn-publish">
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
                <td><img :src="p.imagenUrl" class="img-preview" @error="handleImgError" /></td>
                <td><span class="product-name">{{ p.nombre }}</span></td>
                <td><span class="badge">{{ p.categoria }}</span></td>
                <td><span class="product-price">${{ p.precio.toLocaleString() }}</span></td>
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
import axios from 'axios';

const productos = ref([]);
const isDragging = ref(false);
const editandoId = ref(null);
const nuevo = ref({ nombre: '', precio: 0, categoria: 'Confección', imagenUrl: '' });
const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';

const obtener = async () => {
  try {
    const res = await axios.get(API_URL);
    productos.value = res.data;
  } catch (e) { console.error("Error al obtener productos", e); }
};

const handleDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
};

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) processFile(file);
};

const processFile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => { nuevo.value.imagenUrl = e.target.result; };
  reader.readAsDataURL(file);
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
  if(confirm("¿Eliminar este producto?")) {
    await axios.delete(`${API_URL}/${id}`);
    obtener();
  }
};

const handleImgError = (e) => { e.target.src = 'https://via.placeholder.com/50x50?text=Error'; };

onMounted(obtener);
</script>

<style scoped>
/* Contenedor Principal */
.admin-page-wrapper {
  padding-top: 120px;
  min-height: 100vh;
  background-color: #f4f7f7;
  padding-bottom: 80px;
}

.admin-container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }

.admin-title { 
  color: #004d4d; 
  font-size: 2.2rem; 
  font-weight: 800; 
  text-align: center; 
  margin-bottom: 40px;
}

.admin-card {
  background: white;
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.06);
  margin-bottom: 40px;
}

.card-subtitle { color: #333; margin-bottom: 25px; font-size: 1.3rem; }

/* Formulario */
.admin-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
.full-width { grid-column: span 2; }
.form-group { display: flex; flex-direction: column; gap: 8px; }

label { font-weight: 700; font-size: 0.9rem; color: #444; }

.custom-input, .custom-select {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 2px solid #edf2f2;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box; /* Crucial para que el padding no rompa el ancho */
}

.custom-input:focus, .custom-select:focus {
  border-color: #25d366;
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 4px rgba(37, 211, 102, 0.1);
}

/* Drag & Drop */
.drop-zone {
  border: 2px dashed #cbd5e0;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  background: #f8fafc;
  transition: 0.3s;
  cursor: pointer;
}
.drop-active { border-color: #25d366; background: #f0fff4; }
.btn-search-file { color: #004d4d; font-weight: 700; text-decoration: underline; cursor: pointer; }

.drop-preview { max-height: 180px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.btn-remove-img { display: block; margin: 0 auto; background: #eee; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; }

/* Botones */
.form-actions { display: flex; gap: 15px; margin-top: 30px; }
.btn-publish { flex: 2; background: #004d4d; color: white; border: none; padding: 16px; border-radius: 14px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.3s; }
.btn-publish:hover { background: #003333; transform: translateY(-2px); }
.btn-cancel { flex: 1; background: #f1f5f9; color: #64748b; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; }

/* Tabla */
.table-responsive { overflow-x: auto; }
.products-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
.products-table th { padding: 15px; color: #718096; font-weight: 700; text-align: left; }

.product-row { background: #fff; transition: 0.2s; }
.product-row td { padding: 15px; vertical-align: middle; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
.product-row td:first-child { border-left: 1px solid #f1f5f9; border-radius: 15px 0 0 15px; }
.product-row td:last-child { border-right: 1px solid #f1f5f9; border-radius: 0 15px 15px 0; }

.img-preview { width: 55px; height: 55px; object-fit: cover; border-radius: 10px; border: 2px solid #eee; }
.product-name { font-weight: 700; color: #2d3748; }
.product-price { font-weight: 800; color: #25d366; }
.badge { background: #e6fffa; color: #004d4d; padding: 6px 14px; border-radius: 10px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }

.actions-cell { display: flex; gap: 10px; }
.btn-edit, .btn-delete { border: none; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
.btn-edit { background: #fffaf0; color: #dd6b20; border: 1px solid #feebc8; }
.btn-edit:hover { background: #feebc8; }
.btn-delete { background: #fff5f5; color: #e53e3e; border: 1px solid #fed7d7; }
.btn-delete:hover { background: #fed7d7; }

.mt-10 { margin-top: 10px; }

@media (max-width: 768px) {
  .admin-form-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: span 1; }
}
</style>