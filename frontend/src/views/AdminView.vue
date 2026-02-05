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
        <h3 class="card-subtitle">{{ editandoId ? '📝 Editando Producto' : '🆕 Agregar Nuevo Producto' }}</h3>
        <div class="admin-form-grid">
        <div class="form-group">
            <label>Nombre del Producto</label>
            <input v-model="nuevo.nombre" class="custom-input" placeholder="Ej: Vestido de Gala" />
        </div>
        <div class="form-group">
            <label>Precio ($)</label>
            <input type="number" v-model="nuevo.precio" class="custom-input" />
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
            <div class="st-drop-zone clickable" @click="$refs.fileInput.click()">
            <div v-if="!nuevo.imagenUrl" class="drop-placeholder">
                <div class="icon-folder">📂</div>
                <p><b>Haz clic</b> o arrastra una imagen</p>
                <input type="file" ref="fileInput" @change="handleFileSelect" hidden />
            </div>
            <div v-else class="preview-container">
                <img :src="nuevo.imagenUrl" class="drop-preview" />
                <button @click.stop="nuevo.imagenUrl = ''" class="btn-remove-img">🗑️ Quitar</button>
            </div>
            </div>
        </div>
        </div>
        <div class="form-actions">
        <button @click="guardarProducto" class="btn-publish">{{ editandoId ? 'Actualizar Producto' : 'Publicar Producto' }}</button>
        <button v-if="editandoId" @click="cancelarEdicion" class="btn-cancel">Cancelar</button>
        </div>
    </div>

    <div class="admin-card">
        <h3 class="card-subtitle">📦 Productos Existentes</h3>
        <div class="table-responsive">
        <table class="products-table">
            <thead>
            <tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Acciones</th></tr>
            </thead>
            <tbody>
            <tr v-for="p in productos" :key="p._id">
                <td><img :src="p.imagenUrl" class="img-preview" /></td>
                <td><b>{{ p.nombre }}</b></td>
                <td>${{ p.precio.toLocaleString() }}</td>
                <td class="actions-cell">
                <button @click="cargarEdicion(p)" class="btn-edit">✏️</button>
                <button @click="eliminar(p._id)" class="btn-delete">🗑️</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

    <div v-if="puedeGestionarPersonal" class="admin-card" style="border-top: 5px solid #3498db;">
        <h3 class="card-subtitle">👥 Gestión de Personal</h3>
        
        <div class="admin-form-grid">
        <div class="form-group">
            <label>Nombre del Empleado</label>
            <input v-model="nuevoEmpleado.user" class="custom-input" />
        </div>
        <div class="form-group">
            <label>Contraseña</label>
            <div class="password-wrapper">
            <input :type="showPassEmpleado ? 'text' : 'password'" v-model="nuevoEmpleado.pass" class="custom-input" />
            <button @click="showPassEmpleado = !showPassEmpleado" class="btn-eye">{{ showPassEmpleado ? '👁️' : '🙈' }}</button>
            </div>
        </div>
        <div class="form-group full-width">
            <label>Rango / Rol</label>
            <select v-model="nuevoEmpleado.rol" class="custom-select">
  <option value="Vendedor">Vendedor</option>
  <option value="Ayudante">Ayudante</option>
  <option value="admin">Administrador</option>
  <option value="Programador">Programador 🛠️</option>
</select>
        </div>
        </div>

        <div class="form-actions">
        <button v-if="!editandoEmpleadoId" @click="crearEmpleado" class="btn-add-user">Crear nuevo usuario</button>
        <template v-else>
            <button @click="actualizarEmpleado" class="btn-save-config">Guardar Cambios</button>
            <button @click="cancelarEdicionEmpleado" class="btn-cancel">Cancelar</button>
        </template>
        </div>

        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
        <h4 class="card-subtitle">📋 Lista de Personal</h4>
        <div class="table-responsive">
        <table class="products-table">
            <thead>
            <tr><th>Usuario</th><th>Rol</th><th>Acciones</th></tr>
            </thead>
            <tbody>
            <tr v-for="user in listaEmpleados" :key="user._id">
                <td><b>{{ user.username }}</b></td>
                <td><span class="badge-rol">{{ user.rol }}</span></td>
                <td class="actions-cell">
                <template v-if="puedeEditarA(user.rol)">
                    <button @click="prepararEdicionEmpleado(user)" class="btn-edit">✏️</button>
                    <button @click="eliminarEmpleado(user._id)" class="btn-delete">🗑️</button>
                </template>
                <span v-else class="text-locked">🔒 Protegido</span>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const productos = ref([]);
const listaEmpleados = ref([]);
const editandoId = ref(null);
const editandoEmpleadoId = ref(null);
const showPassEmpleado = ref(false);

const nuevo = ref({ nombre: '', precio: 0, categoria: 'Confección', imagenUrl: '' });
const nuevoEmpleado = ref({ user: '', pass: '', rol: 'Vendedor' });

const nombreUsuarioActual = ref(localStorage.getItem('userName'));
const rolActual = ref(localStorage.getItem('userRol') || '');

const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';
const AUTH_URL = 'https://api-taller-costura.onrender.com/api/auth';
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dg1kg7aya/image/upload';

const puedeGestionarPersonal = computed(() => {
  const r = rolActual.value.toLowerCase();
  return r === 'dueño' || r === 'admin' || r === 'programador';
});

// FUNCIÓN CLAVE: Determina si el usuario logueado puede editar a otro basado en su rol
const puedeEditarA = (rolObjetivo) => {
const miRol = rolActual.value.toLowerCase();
const suRol = rolObjetivo.toLowerCase();

  // Programador y Dueño tienen poder total
if (miRol === 'programador' || miRol === 'dueño') return true; 

if (miRol === 'admin') {
    // Admin NO edita a programadores, otros admins ni dueños
    return suRol !== 'admin' && suRol !== 'dueño' && suRol !== 'programador';
}
return false;
};

const obtener = async () => {
try { const res = await axios.get(API_URL); productos.value = res.data; } catch (e) { console.error(e); }
};

const obtenerEmpleados = async () => {
try { const res = await axios.get(`${AUTH_URL}/users`); listaEmpleados.value = res.data; } catch (e) { console.error(e); }
};

const handleFileSelect = async (e) => {
const file = e.target.files[0];
if(!file) return;
const formData = new FormData();
formData.append('file', file);
formData.append('upload_preset', 'taller-smith');
try {
    const res = await axios.post(CLOUDINARY_URL, formData);
    nuevo.value.imagenUrl = res.data.secure_url;
} catch (e) { alert("Error al subir imagen"); }
};

const guardarProducto = async () => {
try {
    if (editandoId.value) await axios.put(`${API_URL}/${editandoId.value}`, nuevo.value);
    else await axios.post(API_URL, nuevo.value);
    alert("¡Producto guardado!"); cancelarEdicion(); obtener();
} catch (e) { alert("Error"); }
};

const crearEmpleado = async () => {
try {
    await axios.post(`${AUTH_URL}/create-initial`, {
    username: nuevoEmpleado.value.user,
    password: nuevoEmpleado.value.pass,
    rol: nuevoEmpleado.value.rol
    });
    alert("Empleado creado"); cancelarEdicionEmpleado(); obtenerEmpleados();
} catch (e) { alert("Error: El usuario ya existe"); }
};

const prepararEdicionEmpleado = (user) => {
editandoEmpleadoId.value = user._id;
nuevoEmpleado.value = { user: user.username, pass: user.password, rol: user.rol };
window.scrollTo(0, 500);
};

const actualizarEmpleado = async () => {
try {
    await axios.put(`${AUTH_URL}/user/${editandoEmpleadoId.value}`, {
    username: nuevoEmpleado.value.user,
    password: nuevoEmpleado.value.pass,
    rol: nuevoEmpleado.value.rol
    });
    alert("Datos actualizados"); cancelarEdicionEmpleado(); obtenerEmpleados();
} catch (e) { alert("Error"); }
};

const eliminarEmpleado = async (id) => {
if (confirm("¿Estás seguro de eliminar este acceso?")) {
    await axios.delete(`${AUTH_URL}/user/${id}`);
    obtenerEmpleados();
}
};

const cancelarEdicionEmpleado = () => {
editandoEmpleadoId.value = null;
nuevoEmpleado.value = { user: '', pass: '', rol: 'Vendedor' };
};

const cargarEdicion = (p) => { editandoId.value = p._id; nuevo.value = { ...p }; window.scrollTo(0,0); };
const cancelarEdicion = () => { editandoId.value = null; nuevo.value = { nombre: '', precio: 0, categoria: 'Confección', imagenUrl: '' }; };
const eliminar = async (id) => { if(confirm("¿Eliminar?")) { await axios.delete(`${API_URL}/${id}`); obtener(); } };
const logout = () => { localStorage.clear(); router.push('/login'); };

onMounted(() => { obtener(); obtenerEmpleados(); });
</script>

<style scoped>
.admin-page-wrapper { padding: 120px 0 50px; background-color: #f4f7f7; min-height: 100vh; }
.admin-container { max-width: 900px; margin: 0 auto; padding: 0 20px; }

/* NAV SUPERIOR ESTILO RECUPERADO */
.top-admin-nav { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 25px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.badge-rol { background: #e6fffa; color: #004d4d; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; margin-left: 10px; text-transform: uppercase; }
.btn-logout { background: #fff1f1; color: #e53e3e; border: 1px solid #fed7d7; padding: 8px 15px; border-radius: 10px; cursor: pointer; font-weight: 600; }

/* DRAG AND DROP ESTILO RECUPERADO */
.st-drop-zone { border: 2px dashed #cbd5e0; border-radius: 20px; padding: 30px; text-align: center; background: #f8fafc; transition: 0.3s; cursor: pointer; position: relative; }
.icon-folder { font-size: 3rem; margin-bottom: 10px; }
.drop-preview { max-height: 150px; border-radius: 10px; }
.btn-remove-img { position: absolute; top: 10px; right: 10px; background: rgba(255,0,0,0.7); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; }

/* TABLAS Y BOTONES */
.admin-card { background: white; border-radius: 20px; padding: 30px; margin-bottom: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
.admin-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.full-width { grid-column: span 2; }
.custom-input, .custom-select { width: 100%; padding: 12px; border: 2px solid #edf2f2; border-radius: 12px; box-sizing: border-box; }
.password-wrapper { position: relative; }
.btn-eye { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); border: none; background: none; cursor: pointer; }
.products-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
.products-table th { text-align: left; padding: 12px; border-bottom: 2px solid #f1f5f9; }
.products-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
.img-preview { width: 45px; height: 45px; object-fit: cover; border-radius: 10px; }
.actions-cell { display: flex; gap: 10px; align-items: center; }
.btn-edit { background: #f0fff4; border: none; padding: 8px; border-radius: 8px; cursor: pointer; }
.btn-delete { background: #fff5f5; border: none; padding: 8px; border-radius: 8px; cursor: pointer; }
.btn-publish, .btn-add-user, .btn-save-config { background: #004d4d; color: white; border: none; padding: 15px; border-radius: 12px; width: 100%; font-weight: bold; cursor: pointer; margin-top: 10px; }
.btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 15px; border-radius: 12px; width: 100%; font-weight: bold; cursor: pointer; margin-top: 5px; }
.text-locked { color: #94a3b8; font-size: 0.85rem; font-style: italic; }
</style>