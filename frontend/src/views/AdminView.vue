<template>
  <div class="admin-container">
    <h1>Panel de Control - Smith Teilor</h1>

    <section class="admin-form-section">
      <h3>{{ editando ? '✏️ Editando: ' + form.nombre : '🆕 Agregar Nuevo Producto' }}</h3>
      
      <form @submit.prevent="guardarProducto" class="admin-form">
        <div class="input-group">
          <input v-model="form.nombre" placeholder="Nombre del producto" required />
          <input v-model.number="form.precio" type="number" placeholder="Precio ($)" required />
        </div>

        <select v-model="form.categoria">
          <option value="Confección">Confección</option>
          <option value="Arreglo">Arreglo</option>
          <option value="Nuestro Trabajo">Nuestro Trabajo</option>
        </select>

        <div 
          class="drop-zone" 
          @dragover.prevent="dragOver = true" 
          @dragleave="dragOver = false" 
          @drop.prevent="handleDrop"
          :class="{ 'drag-active': dragOver }"
        >
          <div v-if="!form.imagenUrl" class="upload-options">
            <p>Arrastra una imagen aquí</p>
            <span>o</span>
            <button type="button" class="btn-browse" @click="$refs.fileInput.click()">
              Buscar en mi PC
            </button>
            <input 
              type="file" 
              ref="fileInput" 
              style="display: none" 
              accept="image/*,video/*" 
              @change="handleFileSelect"
            />
          </div>
          
          <div v-else class="preview-container">
            <img :src="form.imagenUrl" class="mini-preview" />
            <button type="button" @click="form.imagenUrl = ''" class="btn-remove-img">Cambiar archivo</button>
          </div>
        </div>

        <input v-model="form.imagenUrl" placeholder="URL de la imagen (se genera automáticamente)" required />
        
        <div class="form-buttons">
          <button type="submit" class="btn-save">
            {{ editando ? 'Guardar Cambios' : 'Publicar Producto' }}
          </button>
          <button v-if="editando" type="button" @click="cancelarEdicion" class="btn-cancel">
            Cancelar
          </button>
        </div>
      </form>
    </section>

    <section class="admin-list-section">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Vista</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in prendas" :key="p._id">
            <td><img :src="p.imagenUrl" class="table-img" /></td>
            <td>{{ p.nombre }}</td>
            <td><span class="badge-cat">{{ p.categoria }}</span></td>
            <td><strong>${{ p.precio.toLocaleString() }}</strong></td>
            <td class="actions-td">
              <button @click="prepararEdicion(p)" class="btn-edit" title="Editar">✏️</button>
              <button @click="eliminarProducto(p._id)" class="btn-delete" title="Eliminar">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const prendas = ref([]);
const dragOver = ref(false);
const editando = ref(false);
const editId = ref(null);
const fileInput = ref(null);

const form = ref({
  nombre: '',
  precio: '',
  categoria: 'Confección',
  imagenUrl: ''
});

const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';

const cargarPrendas = async () => {
  try {
    const res = await axios.get(API_URL);
    prendas.value = res.data;
  } catch (e) { console.error(e); }
};

// Función para procesar el archivo (Sea por Drop o por Buscador)
const procesarArchivo = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      form.value.imagenUrl = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleDrop = (e) => {
  dragOver.value = false;
  const file = e.dataTransfer.files[0];
  procesarArchivo(file);
};

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  procesarArchivo(file);
};

const guardarProducto = async () => {
  try {
    if (editando.value) {
      await axios.put(`${API_URL}/${editId.value}`, form.value);
      alert("¡Actualizado!");
    } else {
      await axios.post(API_URL, form.value);
      alert("¡Creado!");
    }
    cancelarEdicion();
    cargarPrendas();
  } catch (e) { alert("Error al guardar"); }
};

const eliminarProducto = async (id) => {
  if (confirm("¿Eliminar este producto permanentemente?")) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      cargarPrendas();
    } catch (e) { alert("Error al eliminar"); }
  }
};

const prepararEdicion = (p) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  editando.value = true;
  editId.value = p._id;
  form.value = { ...p };
};

const cancelarEdicion = () => {
  form.value = { nombre: '', precio: '', categoria: 'Confección', imagenUrl: '' };
  editando.value = false;
  editId.value = null;
};

onMounted(cargarPrendas);
</script>

<style scoped>
.admin-container { max-width: 1000px; margin: 20px auto; padding: 20px; font-family: 'Inter', sans-serif; }
.admin-form { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 40px; }
.input-group { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
input, select { padding: 12px; border-radius: 8px; border: 1px solid #ddd; width: 100%; box-sizing: border-box; }

/* DROP ZONE Y BOTÓN BUSCAR */
.drop-zone { 
  border: 2px dashed #004d4d; 
  border-radius: 12px; 
  padding: 30px; 
  text-align: center; 
  margin: 15px 0; 
  background: #f0f7f7;
  color: #004d4d;
}
.upload-options { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.btn-browse { 
  background: #004d4d; 
  color: white; 
  border: none; 
  padding: 8px 16px; 
  border-radius: 20px; 
  cursor: pointer; 
  font-weight: bold;
}
.btn-remove-img { 
  background: #ff4d4d; 
  color: white; 
  border: none; 
  padding: 5px 12px; 
  border-radius: 5px; 
  cursor: pointer; 
  margin-top: 10px;
}
.drag-active { background: #d1eaea; }
.mini-preview { height: 120px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

/* TABLA */
.admin-table { width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; }
.admin-table th { background: #004d4d; color: white; padding: 15px; text-align: left; }
.admin-table td { padding: 12px; border-bottom: 1px solid #eee; }
.table-img { width: 45px; height: 45px; object-fit: cover; border-radius: 5px; }
.badge-cat { background: #e0f2f2; color: #004d4d; padding: 4px 8px; border-radius: 5px; font-size: 0.8rem; }

.actions-td { display: flex; gap: 8px; }
.btn-edit { background: #f39c12; border: none; padding: 8px; border-radius: 5px; cursor: pointer; color: white; }
.btn-delete { background: #e74c3c; border: none; padding: 8px; border-radius: 5px; cursor: pointer; color: white; }
.btn-save { background: #004d4d; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; flex: 1; }
.btn-cancel { background: #888; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; }
.form-buttons { display: flex; gap: 10px; margin-top: 15px; }
</style>