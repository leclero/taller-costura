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
    
    <h1 class="admin-title">Panel de Control - Teilor Smith</h1>

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
                <option value="dueño">Dueño 👑</option> 
                <option v-if="rolActual.toLowerCase() === 'programador'" value="Programador">Programador 🛠️</option>
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
        <h4 class="card-subtitle">📋 Lista de Personal (Seguridad y Accesos)</h4>
        <div class="table-responsive">
        <table class="products-table">
            <thead>
            <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Contraseña</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in empleadosFiltrados" :key="user._id">
                <td><b>{{ user.username }}</b></td>
                <td><span class="badge-rol">{{ user.rol }}</span></td>
                <td>
                    <code class="pass-display">
                        {{ puedeVerContraseña(user) ? user.password : '********' }}
                    </code>
                </td>
                <td class="actions-cell">
                <template v-if="user.username === nombreUsuarioActual">
                    <button @click="prepararEdicionEmpleado(user)" class="btn-edit-self">✏️ Mi Perfil</button>
                </template>
                <template v-else-if="puedeEditarA(user)">
                    <button @click="prepararEdicionEmpleado(user)" class="btn-edit">✏️</button>
                    <button @click="eliminarEmpleado(user._id)" class="btn-delete">🗑️</button>
                </template>
                <template v-else>
                    <span class="text-locked">🔒 Protegido</span>
                </template>
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

// FILTRO DE SEGURIDAD: El Programador es invisible para Dueño y Admin
const empleadosFiltrados = computed(() => {
    const miRol = (rolActual.value || '').toLowerCase();
    if (miRol === 'programador') return listaEmpleados.value;
    return listaEmpleados.value.filter(u => (u.rol || '').toLowerCase() !== 'programador');
});

const puedeGestionarPersonal = computed(() => {
    const r = (rolActual.value || '').toLowerCase();
    return r === 'dueño' || r === 'admin' || r === 'programador';
});

const puedeEditarA = (usuarioObjetivo) => {
    const miRol = (rolActual.value || '').toLowerCase();
    const suRol = (usuarioObjetivo.rol || '').toLowerCase();
    if (miRol === 'programador' || miRol === 'dueño') {
        const esSuperObjetivo = (suRol === 'programador' || suRol === 'dueño');
        return !esSuperObjetivo; 
    }
    if (miRol === 'admin') return suRol === 'vendedor' || suRol === 'ayudante';
    return false;
};

const puedeVerContraseña = (usuarioObjetivo) => {
    const miRol = (rolActual.value || '').toLowerCase();
    const suRol = (usuarioObjetivo.rol || '').toLowerCase();
    if (nombreUsuarioActual.value === usuarioObjetivo.username) return true;
    if (miRol === 'dueño' || miRol === 'programador') return true;
    if (miRol === 'admin') return !(suRol === 'dueño' || suRol === 'programador');
    return false;
};

// FUNCIONES DE API
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
.top-admin-nav { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 25px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.badge-rol { background: #e6fffa; color: #004d4d; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; margin-left: 10px; text-transform: uppercase; }
.btn-logout { background: #fff1f1; color: #e53e3e; border: 1px solid #fed7d7; padding: 8px 15px; border-radius: 10px; cursor: pointer; font-weight: 600; }
.st-drop-zone { border: 2px dashed #cbd5e0; border-radius: 20px; padding: 30px; text-align: center; background: #f8fafc; transition: 0.3s; cursor: pointer; position: relative; }
.icon-folder { font-size: 3rem; margin-bottom: 10px; }
.drop-preview { max-height: 150px; border-radius: 10px; }
.btn-remove-img { position: absolute; top: 10px; right: 10px; background: rgba(255,0,0,0.7); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
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
.text-locked { color: #94a3b8; font-size: 0.85rem; font-style: italic; background: #f8fafc; padding: 4px 8px; border-radius: 6px; }
.pass-display { background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-family: monospace; color: #475569; font-size: 0.9rem; border: 1px solid #e2e8f0; }
.btn-edit-self { background: #ebf8ff; color: #2b6cb0; border: 1px solid #bee3f8; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s; }
.btn-edit-self:hover { background: #bee3f8; }
</style>