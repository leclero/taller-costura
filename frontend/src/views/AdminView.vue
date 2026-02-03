<template>
  <div class="admin-container">
    <h1>Panel de Administración - Smith Tailor</h1>
    
    <form @submit.prevent="agregarPrenda" class="admin-form">
      <div class="form-grid">
        <div class="form-info">
          <div class="form-group">
            <label>Nombre del Trabajo:</label>
            <input v-model="nuevaPrenda.nombre" placeholder="Ej: Vestido de Gala" required />
          </div>

          <div class="form-group">
            <label>Categoría / Sección:</label>
            <select v-model="nuevaPrenda.categoria" required>
              <option value="Confección">Confección (Carrusel)</option>
              <option value="Arreglo">Arreglo / Reparación (Grilla)</option>
              <option value="Nuestro Trabajo">Nuestro Trabajo (Videos/Fotos)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Precio estimado ($):</label>
            <input type="number" v-model="nuevaPrenda.precio" required />
          </div>
        </div>

        <div class="form-upload">
          <label>Imagen o Video del Trabajo:</label>
          <div 
            class="drop-zone" 
            :class="{ 'dragging': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="$refs.fileInput.click()"
          >
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileSelect" 
              accept="image/*,video/*" 
              hidden 
            />
            <div v-if="!previewUrl" class="drop-placeholder">
              <span>📁</span>
              <p>Arrastra tu foto/video aquí o haz clic</p>
            </div>
            <div v-else class="preview-container">
              <video v-if="esVideo(previewUrl)" :src="previewUrl" class="preview-media"></video>
              <img v-else :src="previewUrl" class="preview-media" />
              <button @click.stop="previewUrl = null" class="btn-clear">Cambiar</button>
            </div>
          </div>
        </div>
      </div>

      <button type="submit" class="btn-save" :disabled="subiendo">
        {{ subiendo ? 'Subiendo...' : 'Guardar Trabajo' }}
      </button>
    </form>

    <div class="lista-prendas">
      <h2>Trabajos Publicados</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Vista</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prenda in prendas" :key="prenda._id">
              <td>
                <img :src="prenda.imagenUrl" class="mini-img" v-if="!esVideo(prenda.imagenUrl)" />
                <span v-else>🎥 Video</span>
              </td>
              <td>{{ prenda.nombre }}</td>
              <td>{{ prenda.categoria }}</td>
              <td>
                <button @click="eliminarPrenda(prenda._id)" class="btn-delete">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';
const prendas = ref([]);
const isDragging = ref(false);
const previewUrl = ref(null);
const fileToUpload = ref(null);
const subiendo = ref(false);

const nuevaPrenda = ref({
  nombre: '',
  categoria: 'Confección',
  precio: 0
});

const obtenerPrendas = async () => {
  const res = await axios.get(API_URL);
  prendas.value = res.data;
};

// Manejo de archivos
const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) processFile(file);
};

const handleDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
};

const processFile = (file) => {
  fileToUpload.value = file;
  previewUrl.value = URL.createObjectURL(file);
};

const esVideo = (url) => url && (url.includes('video') || url.match(/\.(mp4|mov|webm)$/i));

const agregarPrenda = async () => {
  if (!fileToUpload.value) return alert("Por favor sube una imagen o video");
  
  subiendo.value = true;
  const formData = new FormData();
  formData.append('nombre', nuevaPrenda.value.nombre);
  formData.append('categoria', nuevaPrenda.value.categoria);
  formData.append('precio', nuevaPrenda.value.precio);
  formData.append('imagen', fileToUpload.value); // El backend debe recibir 'imagen'

  try {
    await axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert("¡Publicado correctamente!");
    nuevaPrenda.value = { nombre: '', categoria: 'Confección', precio: 0 };
    previewUrl.value = null;
    fileToUpload.value = null;
    obtenerPrendas();
  } catch (err) {
    console.error(err);
    alert("Error al subir. Revisa el tamaño del archivo.");
  } finally {
    subiendo.value = false;
  }
};

const eliminarPrenda = async (id) => {
  if (confirm("¿Eliminar este trabajo?")) {
    await axios.delete(`${API_URL}/${id}`);
    obtenerPrendas();
  }
};

onMounted(obtenerPrendas);
</script>

<style scoped>
.admin-container { max-width: 1000px; margin: 40px auto; padding: 20px; }
.admin-form { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 20px; }

.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: bold; color: #004d4d; }
input, select { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; }

/* ESTILOS DROP ZONE */
.drop-zone {
  border: 2px dashed #004d4d;
  border-radius: 15px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  background: #f0fafa;
  position: relative;
  overflow: hidden;
}
.drop-zone.dragging { background: #004d4d; color: white; border-style: solid; }
.drop-placeholder span { font-size: 3rem; }
.preview-media { width: 100%; height: 100%; object-fit: cover; }
.btn-clear { position: absolute; top: 10px; right: 10px; background: rgba(255,0,0,0.7); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; }

.btn-save { width: 100%; padding: 15px; background: #004d4d; color: white; border: none; border-radius: 10px; font-weight: bold; font-size: 1.1rem; cursor: pointer; }
.btn-save:disabled { background: #ccc; }

.mini-img { width: 50px; height: 50px; object-fit: cover; border-radius: 5px; }
.table-wrapper { background: white; border-radius: 10px; overflow: hidden; margin-top: 20px; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
th { background: #004d4d; color: white; }
.btn-delete { background: #ff4d4d; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; }

@media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
</style>