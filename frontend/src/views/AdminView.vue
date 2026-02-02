<template>
<div class="admin-container">
    <h2>🧵 Panel de Administración</h2>
    <p>Sube tus nuevos trabajos al catálogo</p>

    <div class="upload-card">
    <div 
        class="drop-zone"
        :class="{ 'is-dragging': dragging }"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="handleDrop"
        @click="$refs.fileInput.click()"
    >
        <div v-if="!file">
        <p class="icon">📁</p>
        <p>Arrastra aquí una <b>foto o video</b> o haz clic para buscar</p>
        </div>
        <div v-else class="preview-zone">
        <p>Archivo seleccionado: <strong>{{ file.name }}</strong></p>
        <button @click.stop="file = null" class="btn-clear">Cambiar</button>
        </div>
        <input type="file" ref="fileInput" @change="handleFileSelect" hidden accept="image/*,video/*">
    </div>

    <div class="form-group">
        <label>Nombre de la prenda</label>
        <input v-model="form.nombre" type="text" placeholder="Ej: Vestido de novia encaje">
    </div>

    <div class="form-row">
        <div class="form-group">
        <label>Precio</label>
        <input v-model.number="form.precio" type="number" placeholder="0.00">
        </div>
        <div class="form-group">
        <label>Categoría</label>
        <select v-model="form.categoria">
            <option value="Confección">Confección</option>
            <option value="Arreglo">Arreglo</option>
            <option value="Venta">Venta</option>
        </select>
        </div>
    </div>

    <button 
        @click="subirProducto" 
        class="btn-submit" 
        :disabled="loading || !file"
    >
        {{ loading ? 'Subiendo...' : 'Publicar en el Taller' }}
    </button>
    </div>
</div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';

const dragging = ref(false);
const file = ref(null);
const loading = ref(false);

const form = reactive({
nombre: '',
precio: 0,
categoria: 'Confección'
});

const handleDrop = (e) => {
    dragging.value = false;
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) file.value = droppedFile;
};

const handleFileSelect = (e) => {
    file.value = e.target.files[0];
};

const subirProducto = async () => {
if (!form.nombre || !file.value) {
    alert("Por favor completa el nombre y selecciona una imagen.");
    return;
}

loading.value = true;
const formData = new FormData();
  // 'imagen' debe coincidir con upload.single('imagen') en el backend
formData.append('imagen', file.value); 
formData.append('nombre', form.nombre);
formData.append('precio', form.precio);
formData.append('categoria', form.categoria);

try {
    // URL completa apuntando al endpoint de prendas
    await axios.post('https://api-taller-costura.onrender.com/api/prendas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    alert('¡Trabajo subido con éxito!');
    file.value = null;
    form.nombre = '';
    form.precio = 0;
} catch (error) {
    console.error("Error al subir:", error.response?.data || error);
    alert('Error al subir el producto. Revisa la consola.');
} finally {
    loading.value = false;
}
};
</script>

<style scoped>
.admin-container { max-width: 600px; margin: 40px auto; padding: 20px; font-family: sans-serif; }
.upload-card { background: #fff; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.drop-zone { border: 2px dashed #d1d1d1; padding: 40px; text-align: center; border-radius: 10px; cursor: pointer; transition: all 0.3s; margin-bottom: 20px; }
.drop-zone:hover, .is-dragging { border-color: #ff69b4; background: #fff5f8; }
.icon { font-size: 3rem; margin-bottom: 10px; }
.form-group { margin-bottom: 15px; display: flex; flex-direction: column; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
input, select { padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px; }
.btn-submit { width: 100%; padding: 15px; background: #ff69b4; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 20px; }
.btn-submit:disabled { background: #ccc; }
.btn-clear { background: #eee; border: none; padding: 5px 10px; border-radius: 4px; margin-top: 10px; cursor: pointer; }
</style>