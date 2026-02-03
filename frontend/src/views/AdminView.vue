<template>
<div class="admin-container">
    <h2>🧵 Panel de Administración</h2>
    <p class="subtitle">Gestiona el catálogo de tu taller con elegancia</p>

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
        <input v-model="form.nombre" type="text" placeholder="Ej: Vestido de gala esmeralda">
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
        {{ loading ? 'Procesando...' : 'Publicar en el Taller' }}
    </button>
    </div>

    <div class="list-section">
    <h3>Inventario de Trabajos</h3>
    <div v-if="prendas.length === 0" class="loading-text">Cargando catálogo...</div>
    
    <table v-else class="product-table">
        <thead>
        <tr>
            <th>Imagen</th>
            <th>Detalles</th>
            <th>Precio</th>
            <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="prenda in prendas" :key="prenda._id">
            <td>
            <img :src="prenda.imagenUrl" class="mini-img" alt="Prenda">
            </td>
            <td>
            <div class="product-name">{{ prenda.nombre }}</div>
            <span class="category-badge">{{ prenda.categoria }}</span>
            </td>
            <td class="price-tag">${{ prenda.precio.toLocaleString() }}</td>
            <td>
            <button @click="eliminarProducto(prenda._id)" class="btn-delete">Eliminar</button>
            </td>
        </tr>
        </tbody>
    </table>
    </div>
</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

// ESTADOS
const dragging = ref(false);
const file = ref(null);
const loading = ref(false);
const prendas = ref([]);

// URL de tu API en Render
const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';

const form = reactive({
nombre: '',
precio: 0,
categoria: 'Confección'
});

// FUNCIONES
const obtenerProductos = async () => {
try {
    const res = await axios.get(API_URL);
    prendas.value = res.data;
} catch (error) {
    console.error("Error al obtener productos:", error);
}
};

onMounted(obtenerProductos);

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
formData.append('imagen', file.value); 
formData.append('nombre', form.nombre);
formData.append('precio', form.precio);
formData.append('categoria', form.categoria);

try {
    const res = await axios.post(API_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    // Actualización inmediata del estado local
    prendas.value.unshift(res.data);
    
    alert('¡Trabajo subido con éxito!');
    
    // Limpiar formulario
    file.value = null;
    form.nombre = '';
    form.precio = 0;
} catch (error) {
    console.error("Error al subir:", error);
    alert('Error al subir el producto.');
} finally {
    loading.value = false;
}
};

const eliminarProducto = async (id) => {
if (!confirm("¿Seguro que quieres eliminar este trabajo?")) return;

try {
    await axios.delete(`${API_URL}/${id}`);
    // Actualización visual inmediata
    prendas.value = prendas.value.filter(p => p._id !== id);
} catch (error) {
    console.error("Error al eliminar:", error);
    alert("No se pudo eliminar el producto.");
}
};
</script>

<style scoped>
/* CONTENEDOR PRINCIPAL */
.admin-container { 
max-width: 1000px; 
margin: 0 auto; 
padding: 40px 20px; 
font-family: 'Inter', sans-serif;
color: #2c3e50;
}

h2 { font-size: 2rem; color: #004d4d; text-align: center; margin-bottom: 8px; }
.subtitle { text-align: center; color: #666; margin-bottom: 40px; }

/* CARD DE CARGA */
.upload-card { 
background: #fff; 
padding: 35px; 
border-radius: 20px; 
box-shadow: 0 10px 40px rgba(0, 77, 77, 0.05); 
border: 1px solid #e0f2f2;
margin-bottom: 50px;
}

.drop-zone { 
border: 2px dashed #b2d8d8; 
padding: 30px; 
text-align: center; 
border-radius: 12px; 
background: #f0fafa;
transition: all 0.3s ease;
cursor: pointer;
}
.drop-zone:hover, .is-dragging { 
border-color: #008080; 
background: #e6f7f7; 
}

.icon { font-size: 2.5rem; margin-bottom: 10px; display: block; }

/* FORMULARIO */
.form-group { margin-bottom: 20px; }
label { font-weight: 600; color: #004d4d; margin-bottom: 8px; display: block; font-size: 0.9rem; }

input, select { 
width: 100%; padding: 12px; 
border: 1px solid #cce5e5; 
border-radius: 10px; 
font-size: 1rem;
transition: all 0.3s;
box-sizing: border-box;
}
input:focus { 
border-color: #008080; 
outline: none; 
box-shadow: 0 0 0 3px rgba(0, 128, 128, 0.1); 
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

/* BOTÓN PRINCIPAL */
.btn-submit { 
width: 100%; padding: 16px; 
background: linear-gradient(135deg, #006666 0%, #004d4d 100%);
color: white; border: none; border-radius: 12px; 
font-weight: 600; font-size: 1.1rem; cursor: pointer; 
box-shadow: 0 4px 15px rgba(0, 77, 77, 0.2);
transition: all 0.2s;
margin-top: 10px;
}
.btn-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 77, 77, 0.3); }
.btn-submit:disabled { background: #dcdde1; transform: none; box-shadow: none; cursor: not-allowed; }

/* SECCIÓN DE LISTADO */
.list-section { width: 100%; }
h3 { margin-bottom: 25px; color: #004d4d; border-bottom: 2px solid #006666; display: inline-block; padding-bottom: 5px; }

.product-table { width: 100%; border-collapse: separate; border-spacing: 0 12px; }
.product-table tr { background: white; transition: transform 0.2s; }
.product-table tr:hover { transform: scale(1.005); }

.product-table th { padding: 12px; text-align: left; color: #95a5a6; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }

.product-table td { 
padding: 15px; 
border-top: 1px solid #f0fafa; 
border-bottom: 1px solid #f0fafa; 
}
.product-table td:first-child { border-left: 1px solid #f0fafa; border-radius: 12px 0 0 12px; }
.product-table td:last-child { border-right: 1px solid #f0fafa; border-radius: 0 12px 12px 0; }

.mini-img { 
width: 65px; height: 65px; object-fit: cover; 
border-radius: 10px; border: 1px solid #e0f2f2;
box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.product-name { font-weight: 600; color: #004d4d; font-size: 1rem; margin-bottom: 4px; }

.category-badge { 
background: #e6f7f7; 
color: #006666; 
padding: 4px 12px; 
border-radius: 20px; 
font-size: 0.75rem; 
font-weight: 700; 
}

.price-tag { font-weight: 700; color: #2c3e50; font-size: 1.1rem; }

/* BOTONES DE ACCIÓN */
.btn-delete { 
background: #fff; color: #e74c3c; 
border: 1px solid #f5c6cb; padding: 8px 15px; 
border-radius: 8px; cursor: pointer;
transition: all 0.3s;
}
.btn-delete:hover { background: #e74c3c; color: white; }

.btn-clear { background: #eee; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
.loading-text { text-align: center; color: #95a5a6; padding: 40px; }
</style>