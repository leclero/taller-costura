<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>Panel de Control - Smith Teilor</h1>
      <router-link to="/" class="btn-back">← Volver al Inicio</router-link>
    </header>

    <section class="admin-form-section">
      <div class="form-card">
        <h3>{{ editando ? '✏️ Editando Producto' : '🆕 Agregar Nuevo Producto' }}</h3>
        
        <form @submit.prevent="guardarProducto" class="admin-form">
          <div class="input-group">
            <div class="field">
              <label>Nombre del Producto</label>
              <input v-model="form.nombre" placeholder="Ej: Camisa entallada" required />
            </div>
            <div class="field">
              <label>Precio ($)</label>
              <input v-model.number="form.precio" type="number" placeholder="0.00" required />
            </div>
          </div>

          <div class="field">
            <label>Categoría</label>
            <select v-model="form.categoria">
              <option value="Confección">Confección</option>
              <option value="Arreglo">Arreglo</option>
              <option value="Nuestro Trabajo">Nuestro Trabajo</option>
            </select>
          </div>

          <div class="field">
            <label>Imagen del Producto</label>
            <div 
              class="drop-zone" 
              @dragover.prevent="dragOver = true" 
              @dragleave="dragOver = false" 
              @drop.prevent="handleDrop"
              :class="{ 'drag-active': dragOver }"
            >
              <div v-if="!imagenPreview" class="upload-options">
                <p>Arrastra una foto aquí</p>
                <span>o</span>
                <button type="button" class="btn-browse" @click="$refs.fileInput.click()">
                  Buscar en mi PC
                </button>
                <input 
                  type="file" 
                  ref="fileInput" 
                  style="display: none" 
                  accept="image/*" 
                  @change="handleFileSelect"
                />
              </div>
              
              <div v-else class="preview-container">
                <img :src="imagenPreview" class="mini-preview" />
                <button type="button" @click="limpiarImagen" class="btn-remove-img">Cambiar Imagen</button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-save" :disabled="subiendo">
              <span v-if="subiendo">⌛ Procesando...</span>
              <span v-else>{{ editando ? 'Guardar Cambios' : 'Publicar Producto' }}</span>
            </button>
            <button v-if="editando" type="button" @click="cancelarEdicion" class="btn-cancel">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>

    <section class="admin-list-section">
      <div class="table-wrapper">
        <table class="admin-table">
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
            <tr v-for="p in prendas" :key="p._id">
              <td><img :src="p.imagenUrl" class="table-img" /></td>
              <td><strong>{{ p.nombre }}</strong></td>
              <td><span class="badge">{{ p.categoria }}</span></td>
              <td>${{ p.precio.toLocaleString() }}</td>
              <td class="actions-td">
                <button @click="prepararEdicion(p)" class="btn-action-edit" title="Editar">✏️</button>
                <button @click="eliminarProducto(p._id)" class="btn-action-delete" title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// ESTADOS
const prendas = ref([]);
const dragOver = ref(false);
const editando = ref(false);
const editId = ref(null);
const subiendo = ref(false);
const imagenPreview = ref('');
const archivoSeleccionado = ref(null);

const form = ref({
  nombre: '',
  precio: '',
  categoria: 'Confección'
});

const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';

// FUNCIONES
const cargarPrendas = async () => {
  try {
    const res = await axios.get(API_URL);
    prendas.value = res.data;
  } catch (e) { console.error("Error al cargar prendas", e); }
};

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    archivoSeleccionado.value = file;
    imagenPreview.value = URL.createObjectURL(file);
  }
};

const handleDrop = (e) => {
  dragOver.value = false;
  const file = e.dataTransfer.files[0];
  if (file) {
    archivoSeleccionado.value = file;
    imagenPreview.value = URL.createObjectURL(file);
  }
};

const limpiarImagen = () => {
  archivoSeleccionado.value = null;
  imagenPreview.value = '';
};

const guardarProducto = async () => {
  try {
    subiendo.value = true;
    
    // Usamos FormData para que Cloudinary reciba el archivo correctamente
    const formData = new FormData();
    formData.append('nombre', form.value.nombre);
    formData.append('precio', form.value.precio);
    formData.append('categoria', form.value.categoria);
    
    if (archivoSeleccionado.value) {
      formData.append('imagen', archivoSeleccionado.value);
    }

    if (editando.value) {
      await axios.put(`${API_URL}/${editId.value}`, formData);
      alert("Producto actualizado con éxito");
    } else {
      await axios.post(API_URL, formData);
      alert("Producto creado con éxito");
    }
    
    cancelarEdicion();
    cargarPrendas();
  } catch (e) {
    console.error(e);
    alert("Error al guardar. Verifica la conexión con el servidor.");
  } finally {
    subiendo.value = false;
  }
};

const eliminarProducto = async (id) => {
  if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      cargarPrendas();
    } catch (e) { alert("No se pudo eliminar."); }
  }
};

const prepararEdicion = (p) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  editando.value = true;
  editId.value = p._id;
  form.value = { nombre: p.nombre, precio: p.precio, categoria: p.categoria };
  imagenPreview.value = p.imagenUrl;
  archivoSeleccionado.value = null;
};

const cancelarEdicion = () => {
  form.value = { nombre: '', precio: '', categoria: 'Confección' };
  limpiarImagen();
  editando.value = false;
  editId.value = null;
};

onMounted(cargarPrendas);
</script>

<style scoped>
.admin-container { max-width: 1100px; margin: 30px auto; padding: 0 20px; font-family: 'Inter', sans-serif; color: #333; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.btn-back { text-decoration: none; color: #004d4d; font-weight: bold; border: 1px solid #004d4d; padding: 8px 15px; border-radius: 8px; transition: 0.3s; }
.btn-back:hover { background: #004d4d; color: white; }

/* FORM CARD */
.form-card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
.admin-form { display: grid; gap: 20px; }
.input-group { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.field { display: flex; flex-direction: column; gap: 8px; }
.field label { font-weight: bold; font-size: 0.9rem; color: #666; }
input, select { padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }

/* DROP ZONE */
.drop-zone { border: 2px dashed #004d4d; border-radius: 12px; padding: 40px; text-align: center; background: #f9fdfd; transition: 0.3s; }
.drag-active { background: #e0f2f2; border-color: #25d366; }
.upload-options { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.btn-browse { background: #004d4d; color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; font-weight: bold; }
.mini-preview { height: 150px; border-radius: 10px; object-fit: cover; margin-bottom: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.btn-remove-img { background: #ff4d4d; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; }

/* BOTONES */
.form-actions { display: flex; gap: 15px; }
.btn-save { flex: 2; background: #004d4d; color: white; border: none; padding: 15px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 1rem; }
.btn-save:disabled { background: #999; }
.btn-cancel { flex: 1; background: #eee; color: #666; border: none; padding: 15px; border-radius: 10px; font-weight: bold; cursor: pointer; }

/* TABLA */
.table-wrapper { margin-top: 50px; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { background: #f4f7f7; padding: 15px; text-align: left; color: #004d4d; }
.admin-table td { padding: 15px; border-bottom: 1px solid #eee; }
.table-img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; }
.badge { background: #e0f2f2; color: #004d4d; padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; }
.actions-td { display: flex; gap: 10px; }
.btn-action-edit { background: #f39c12; border: none; padding: 8px; border-radius: 6px; cursor: pointer; color: white; }
.btn-action-delete { background: #e74c3c; border: none; padding: 8px; border-radius: 6px; cursor: pointer; color: white; }

@media (max-width: 768px) { .input-group { grid-template-columns: 1fr; } }
</style>