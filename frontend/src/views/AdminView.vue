<template>
<div class="admin-page-wrapper">
    <div class="admin-container">
      
      <div class="top-admin-nav">
        <div class="user-info">
          <span class="user-welcome">Bienvenido, <b>{{ nombreUsuarioActual }}</b></span>
          <span class="badge-rol">{{ rolActual }}</span>
        </div>
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
              class="st-drop-zone clickable" 
              :class="{ 'drop-active': isDragging, 'is-loading': isUploading }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="$refs.fileInput.click()"
            >
              <div v-if="isUploading" class="upload-status">
                <div class="spinner"></div>
                <p>Subiendo a la nube...</p>
              </div>

              <div v-else-if="!nuevo.imagenUrl" class="drop-placeholder">
                <div class="icon-folder">📂</div>
                <p class="drop-text"><b>Haz clic para abrir la carpeta</b> o arrastra una imagen</p>
                <input type="file" ref="fileInput" @change="handleFileSelect" hidden accept="image/*" />
              </div>

              <div v-else class="preview-container" @click.stop>
                <img :src="nuevo.imagenUrl" class="drop-preview" />
                <button @click="nuevo.imagenUrl = ''" class="btn-remove-img">🗑️ Quitar imagen</button>
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
                <td><img :src="p.imagenUrl" class="img-preview" /></td>
                <td><b>{{ p.nombre }}</b></td>
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

      <div v-if="rolActual === 'Dueño' || rolActual === 'admin'" class="admin-card" style="border-top: 5px solid #3498db;">
        <h3 class="card-subtitle">👥 Gestión de Personal</h3>
        <div class="admin-form-grid">
          <div class="form-group">
            <label>Nombre del Empleado</label>
            <input v-model="nuevoEmpleado.user" class="custom-input" placeholder="Ej: Maria" />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input v-model="nuevoEmpleado.pass" type="password" class="custom-input" placeholder="••••" />
          </div>
          <div class="form-group full-width">
            <label>Rango / Rol</label>
            <select v-model="nuevoEmpleado.rol" class="custom-select">
              <option value="Vendedor">Vendedor</option>
              <option value="Ayudante">Ayudante</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button @click="crearEmpleado" class="btn-add-user">Crear nuevo usuario</button>
        </div>
      </div>

      <div class="admin-card" style="border-top: 5px solid #2ecc71; margin-top: 40px;">
        <h3 class="card-subtitle">🔐 Mis Datos de Acceso</h3>
        <div class="admin-form-grid">
          <div class="form-group">
            <label>Mi Usuario</label>
            <input v-model="config.nuevoUsuario" class="custom-input" />
          </div>
          <div class="form-group">
            <label>Nueva Contraseña</label>
            <div class="password-wrapper">
              <input :type="showPass ? 'text' : 'password'" v-model="config.nuevaPass" class="custom-input" />
              <button @click="showPass = !showPass" class="btn-eye">{{ showPass ? '👁️' : '🙈' }}</button>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button @click="actualizarMiPerfil" class="btn-save-config">Guardar cambios</button>
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
const config = ref({ nuevoUsuario: localStorage.getItem('userName') || '', nuevaPass: '' });
const nuevoEmpleado = ref({ user: '', pass: '', rol: 'Vendedor' });
const showPass = ref(false);

const nombreUsuarioActual = ref(localStorage.getItem('userName'));
const rolActual = ref(localStorage.getItem('userRol'));

const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';
const AUTH_URL = 'https://api-taller-costura.onrender.com/api/auth';
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dg1kg7aya/image/upload';
const UPLOAD_PRESET = 'taller-smith';

const obtener = async () => {
  try {
    const res = await axios.get(API_URL);
    productos.value = res.data;
  } catch (e) { console.error(e); }
};

const guardarProducto = async () => {
  if(!nuevo.value.nombre || !nuevo.value.imagenUrl) return alert("Completa los datos");
  try {
    if (editandoId.value) await axios.put(`${API_URL}/${editandoId.value}`, nuevo.value);
    else await axios.post(API_URL, nuevo.value);
    alert("¡Guardado correctamente!");
    cancelarEdicion();
    obtener();
  } catch (e) { alert("Error al guardar"); }
};

const crearEmpleado = async () => {
  if(!nuevoEmpleado.value.user || !nuevoEmpleado.value.pass) return alert("Faltan datos");
  try {
    await axios.post(`${AUTH_URL}/register`, nuevoEmpleado.value);
    alert("Empleado creado con éxito");
    nuevoEmpleado.value = { user: '', pass: '', rol: 'Vendedor' };
  } catch (e) { alert("Error al crear usuario"); }
};

const actualizarMiPerfil = async () => {
  const myId = localStorage.getItem('userId');
  try {
    await axios.put(`${AUTH_URL}/update-profile/${myId}`, {
      nuevoUsuario: config.value.nuevoUsuario,
      nuevaPass: config.value.nuevaPass,
      solicitanteId: myId
    });
    alert("Datos actualizados");
    localStorage.setItem('userName', config.value.nuevoUsuario);
    nombreUsuarioActual.value = config.value.nuevoUsuario;
  } catch (e) { alert("Error al actualizar"); }
};

const handleFileSelect = (e) => { const file = e.target.files[0]; if(file) subirImagen(file); };
const handleDrop = (e) => { isDragging.value = false; const file = e.dataTransfer.files[0]; if(file) subirImagen(file); };

const subirImagen = async (file) => {
  isUploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  try {
    const res = await axios.post(CLOUDINARY_URL, formData);
    nuevo.value.imagenUrl = res.data.secure_url;
  } catch (e) { alert("Error al subir imagen"); }
  finally { isUploading.value = false; }
};

const eliminar = async (id) => { if(confirm("¿Eliminar este producto?")) { await axios.delete(`${API_URL}/${id}`); obtener(); } };
const cargarEdicion = (p) => { editandoId.value = p._id; nuevo.value = { ...p }; window.scrollTo(0,0); };
const cancelarEdicion = () => { editandoId.value = null; nuevo.value = { nombre: '', precio: 0, categoria: 'Confección', imagenUrl: '' }; };
const logout = () => { localStorage.clear(); router.push('/login'); };

onMounted(obtener);
</script>

<style scoped>
.admin-page-wrapper { 
  /* Añadimos un padding superior generoso (120px) para bajar todo el contenido */
  padding: 120px 0 50px; 
  background-color: #f4f7f7; 
  min-height: 100vh; 
  /* Aseguramos que el contenido empiece después de la barra de App.vue */
  box-sizing: border-box; 
}

/* NAV */
.top-admin-nav { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 25px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.badge-rol { background: #e6fffa; color: #004d4d; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; margin-left: 10px; text-transform: uppercase; }
.btn-logout { background: #fff1f1; color: #e53e3e; border: 1px solid #fed7d7; padding: 8px 15px; border-radius: 10px; cursor: pointer; font-weight: 600; transition: 0.2s; }
.btn-logout:hover { background: #ffe4e4; }

/* CARDS */
.admin-card { background: white; border-radius: 20px; padding: 30px; margin-bottom: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.02); }
.admin-title { color: #004d4d; text-align: center; margin-bottom: 30px; font-weight: 800; }
.card-subtitle { margin-bottom: 25px; color: #2d3748; font-size: 1.2rem; }

/* FORMS */
.admin-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.full-width { grid-column: span 2; }
.custom-input, .custom-select { width: 100%; padding: 12px; border: 2px solid #edf2f2; border-radius: 12px; outline: none; box-sizing: border-box; transition: 0.3s; }
.custom-input:focus, .custom-select:focus { border-color: #2ecc71; }
label { display: block; margin-bottom: 8px; font-weight: 700; color: #4a5568; font-size: 0.9rem; }

/* DROPZONE MEJORADA */
.st-drop-zone { border: 2px dashed #cbd5e0; border-radius: 20px; padding: 40px; text-align: center; background: #f8fafc; transition: 0.3s; cursor: pointer; position: relative; }
.st-drop-zone:hover { background: #f1f5f9; border-color: #a0aec0; }
.drop-active { border-color: #004d4d; background: #e6fffa; }
.icon-folder { font-size: 3.5rem; margin-bottom: 10px; }
.drop-text { color: #4a5568; margin: 0; }
.drop-text b { color: #004d4d; }

.preview-container { position: relative; display: inline-block; }
.drop-preview { max-width: 100%; max-height: 250px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.btn-remove-img { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-weight: bold; color: #e53e3e; }

/* TABLA */
.table-responsive { overflow-x: auto; }
.products-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
.products-table th { text-align: left; padding: 12px; border-bottom: 2px solid #f1f5f9; color: #718096; }
.products-table td { padding: 15px 12px; border-bottom: 1px solid #f1f5f9; }
.img-preview { width: 45px; height: 45px; object-fit: cover; border-radius: 10px; }
.product-price { font-weight: 800; color: #2d3748; }

/* ACCIONES */
.actions-cell { display: flex; gap: 8px; }
.btn-edit, .btn-delete { border: none; padding: 8px 12px; border-radius: 10px; cursor: pointer; transition: 0.2s; font-size: 1.1rem; }
.btn-edit { background: #f1f5f9; color: #4a5568; }
.btn-edit:hover { background: #e2e8f0; }
.btn-delete { background: #fff5f5; color: #e53e3e; }
.btn-delete:hover { background: #fee2e2; }

/* BOTONES PRINCIPALES */
.form-actions { margin-top: 25px; display: flex; gap: 10px; }
.btn-publish, .btn-save-config, .btn-add-user { flex: 1; padding: 15px; border: none; border-radius: 14px; font-weight: 800; color: white; cursor: pointer; transition: 0.3s; font-size: 1rem; }
.btn-publish { background: #004d4d; }
.btn-publish:hover { background: #003333; transform: translateY(-2px); }
.btn-save-config { background: #2ecc71; }
.btn-save-config:hover { background: #27ae60; transform: translateY(-2px); }
.btn-add-user { background: #3498db; }
.btn-add-user:hover { background: #2980b9; transform: translateY(-2px); }
.btn-cancel { background: #edf2f7; color: #4a5568; padding: 15px 25px; border: none; border-radius: 14px; cursor: pointer; font-weight: 700; }

/* PASSWORD WRAPPER */
.password-wrapper { position: relative; }
.btn-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1.2rem; }

.spinner { width: 30px; height: 30px; border: 4px solid #f3f3f3; border-top: 4px solid #004d4d; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 650px) { 
  .admin-form-grid { grid-template-columns: 1fr; } 
  .full-width { grid-column: span 1; }
  .form-actions { flex-direction: column; }
}
</style>