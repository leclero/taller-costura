<template>
    <div class="admin-page-wrapper">
        <div class="admin-container">

            <div class="top-admin-nav">
                <div class="user-info">
                    <span class="user-welcome">Bienvenido, <b>{{ nombreUsuarioActual }}</b></span>
                    <span class="badge-rol">{{ rolActual }}</span>
                </div>
                <button @click="logout" class="btn-smith btn-smith-danger">Cerrar Sesión 🔒</button>
            </div>

            <h1 class="admin-title">Panel de Control - Teilor Smith</h1>

            <div class="card-smith">
                <h3 class="card-subtitle">{{ editandoId ? '📝 Editando Producto' : '🆕 Agregar Nuevo Producto' }}</h3>

                <div class="admin-form-grid">
                    <div class="form-group">
                        <label>Nombre del Producto</label>
                        <input v-model="nuevo.nombre" class="input-smith" placeholder="Ej: Vestido de Gala" />
                    </div>
                    <div class="form-group">
                        <label>Precio ($)</label>
                        <input type="number" v-model="nuevo.precio" class="input-smith" />
                    </div>
                    <div class="form-group full-width">
                        <label>Categoría</label>
                        <select v-model="nuevo.categoria" class="input-smith">
                            <option value="Confección">Confección</option>
                            <option value="Arreglo">Arreglo</option>
                            <option value="Nuestro Trabajo">Nuestro Trabajo (Carrusel)</option>
                        </select>
                    </div>

                    <div class="form-group full-width">
                        <label>Imagen o Video del Producto</label>
                        <div class="st-drop-zone" :class="{ 'drag-active': dragOver }" @click="$refs.fileInput.click()"
                            @dragover.prevent="dragOver = true" @dragleave.prevent="dragOver = false"
                            @drop.prevent="handleDrop">
                            <div v-if="!nuevo.imagenUrl" class="drop-placeholder">
                                <div class="icon-folder">{{ subiendo ? '⏳' : '📂' }}</div>
                                <p v-if="!subiendo"><b>Arrastra un archivo</b> o haz clic para buscar</p>
                                <p v-else>Subiendo a la nube...</p>
                                <input type="file" ref="fileInput" @change="handleFileSelect" hidden
                                    accept=".jpg, .jpeg, .png, .webp, .mp4, .mov, .webm, image/*, video/*,.mp4,.mov,.webm,.m4v" />
                            </div>
                            <div v-else class="preview-container">
                                <video v-if="nuevo.imagenUrl.includes('/video/') || nuevo.imagenUrl.endsWith('.mp4')"
                                    :src="nuevo.imagenUrl" controls class="drop-preview">
                                </video>

                                <img v-else :src="nuevo.imagenUrl" class="drop-preview" />

                                <div class="preview-actions">
                                    <button @click.stop="nuevo.imagenUrl = ''" class="btn-smith btn-smith-danger">🗑️
                                        Quitar Archivo</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button @click="guardarProducto" class="btn-smith btn-smith-primary" style="flex: 2"
                        :disabled="subiendo">
                        {{ editandoId ? 'Actualizar Producto' : 'Publicar Producto' }}
                    </button>
                    <button v-if="editandoId" @click="cancelarEdicion" class="btn-smith btn-smith-outline"
                        style="flex: 1">Cancelar</button>
                </div>
            </div>

            <div class="card-smith">
                <h3 class="card-subtitle">📦 Productos Existentes</h3>
                <div class="table-responsive">
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>Miniatura</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in productos" :key="p._id">
                                <td>
                                    <video v-if="p.imagenUrl && p.imagenUrl.includes('/video/')" :src="p.imagenUrl" class="img-preview"></video>
                                    <img v-else :src="p.imagenUrl" class="img-preview" />
                                </td>
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

            <div v-if="puedeGestionarPersonal" id="form-personal" class="card-smith personal-card">
                <h3 class="card-subtitle">👥 Gestión de Personal</h3>

                <div class="admin-form-grid">
                    <div class="form-group">
                        <label>Nombre del Empleado</label>
                        <input v-model="nuevoEmpleado.user" class="input-smith" />
                    </div>
                    <div class="form-group">
                        <label>Contraseña</label>
                        <div class="password-wrapper">
                            <input :type="showPassEmpleado ? 'text' : 'password'" v-model="nuevoEmpleado.pass"
                                class="input-smith" />
                            <button @click="showPassEmpleado = !showPassEmpleado" class="btn-eye">
                                {{ showPassEmpleado ? '👁️' : '🙈' }}
                            </button>
                        </div>
                    </div>
                    <div class="form-group full-width">
                        <label>Rango / Rol</label>
                        <select v-model="nuevoEmpleado.rol" class="input-smith">
                            <option value="Vendedor">Vendedor</option>
                            <option value="Ayudante">Ayudante</option>
                            <option v-if="['admin', 'dueño', 'programador'].includes(rolActual.toLowerCase())"
                                value="admin">Administrador</option>
                            <option v-if="['dueño', 'programador'].includes(rolActual.toLowerCase())" value="dueño">
                                Dueño 👑</option>
                            <option v-if="rolActual.toLowerCase() === 'programador'" value="Programador">Programador 🛠️
                            </option>
                        </select>
                    </div>
                </div>

                <div class="form-actions">
                    <button v-if="!editandoEmpleadoId" @click="crearEmpleado" class="btn-smith btn-smith-primary">Crear
                        nuevo usuario</button>
                    <template v-else>
                        <button @click="actualizarEmpleado" class="btn-smith btn-smith-primary">Guardar Cambios</button>
                        <button @click="cancelarEdicionEmpleado" class="btn-smith btn-smith-outline">Cancelar</button>
                    </template>
                </div>

                <hr class="separator">

                <h4 class="card-subtitle">📋 Lista de Personal</h4>
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
                                        <button @click="prepararEdicionEmpleado(user)" class="btn-edit-self">✏️ Mi
                                            Perfil</button>
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

            <footer class="admin-footer">
                <p>© 2026 Teilor Smith - Panel de Gestión Seguro</p>
            </footer>

        </div>
        <button @click="volverArriba" class="btn-scroll-top" :class="{ 'show': showScrollBtn }">↑</button>
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
const showScrollBtn = ref(false);
const dragOver = ref(false);
const subiendo = ref(false);

const nuevo = ref({ nombre: '', precio: 0, categoria: 'Confección', imagenUrl: '' });
const nuevoEmpleado = ref({ user: '', pass: '', rol: 'Vendedor' });

const nombreUsuarioActual = ref(localStorage.getItem('userName'));
const rolActual = ref(localStorage.getItem('userRol') || '');
const token = localStorage.getItem('userToken');

const API_URL = 'https://api-taller-costura.onrender.com/api/prendas';
const AUTH_URL = 'https://api-taller-costura.onrender.com/api/auth';

const empleadosFiltrados = computed(() => {
    const miRol = (rolActual.value || '').toLowerCase();
    if (miRol === 'programador') return listaEmpleados.value;
    return listaEmpleados.value.filter(u => (u.rol || '').toLowerCase() !== 'programador');
});

const puedeGestionarPersonal = computed(() => {
    const r = (rolActual.value || '').toLowerCase();
    return ['dueño', 'admin', 'programador'].includes(r);
});

const puedeEditarA = (usuarioObjetivo) => {
    const miRol = (rolActual.value || '').toLowerCase();
    const suRol = (usuarioObjetivo.rol || '').toLowerCase();
    if (miRol === 'programador' || miRol === 'dueño') return !(suRol === 'programador' || suRol === 'dueño');
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

const handleDrop = (e) => {
    dragOver.value = false;
    const file = e.dataTransfer.files[0];
    if (file) subirArchivo(file);
};

const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) subirArchivo(file);
};

// FUNCIÓN DE SUBIDA ADAPTADA PARA IMÁGENES Y VIDEOS
const subirArchivo = async (file) => {
    const esVideo = file.type.startsWith('video/');
    const esImagen = file.type.startsWith('image/');

    if (!esVideo && !esImagen) {
        alert("Por favor selecciona una imagen o un video válido.");
        return;
    }

    subiendo.value = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'taller-smith');

    const tipoRecurso = esVideo ? 'video' : 'image';
    const URL_CLOUDINARY = `https://api.cloudinary.com/v1_1/dg1kg7aya/${tipoRecurso}/upload`;

    try {
        const res = await axios.post(URL_CLOUDINARY, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        nuevo.value.imagenUrl = res.data.secure_url;
    } catch (e) {
        console.error("Error Cloudinary:", e.response?.data || e);
        alert("Error al subir el archivo.");
    } finally {
        subiendo.value = false;
    }
};

const obtener = async () => {
    try { const res = await axios.get(API_URL); productos.value = res.data; }
    catch (e) { console.error(e); }
};

const guardarProducto = async () => {
    if (!nuevo.value.imagenUrl) return alert("Sube un archivo primero");
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        if (editandoId.value) {
            await axios.put(`${API_URL}/${editandoId.value}`, nuevo.value, config);
        } else {
            await axios.post(API_URL, nuevo.value, config);
        }
        alert("¡Éxito!");
        cancelarEdicion();
        obtener();
    } catch (e) { alert("Error de permisos o sesión expirada"); }
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
    if (!confirm("¿Eliminar producto?")) return;
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`${API_URL}/${id}`, config);
        obtener();
    } catch (e) { alert("Error al eliminar"); }
};

const obtenerEmpleados = async () => {
    try { const res = await axios.get(`${AUTH_URL}/users`); listaEmpleados.value = res.data; }
    catch (e) { console.error(e); }
};

const crearEmpleado = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.post(`${AUTH_URL}/create-initial`, {
            username: nuevoEmpleado.value.user,
            password: nuevoEmpleado.value.pass,
            rol: nuevoEmpleado.value.rol
        }, config);
        alert("Usuario creado"); cancelarEdicionEmpleado(); obtenerEmpleados();
    } catch (e) { alert("Error al crear"); }
};

const actualizarEmpleado = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`${AUTH_URL}/user/${editandoEmpleadoId.value}`, {
            username: nuevoEmpleado.value.user,
            password: nuevoEmpleado.value.pass,
            rol: nuevoEmpleado.value.rol
        }, config);
        alert("✅ Usuario actualizado");
        cancelarEdicionEmpleado();
        obtenerEmpleados();
    } catch (e) { alert("Error al actualizar"); }
};

const eliminarEmpleado = async (id) => {
    if (!confirm("¿Eliminar usuario?")) return;
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`${AUTH_URL}/user/${id}`, config);
        obtenerEmpleados();
    } catch (e) { alert("Error"); }
};

const prepararEdicionEmpleado = (user) => {
    editandoEmpleadoId.value = user._id;
    nuevoEmpleado.value = { user: user.username, pass: user.password, rol: user.rol };
    document.getElementById('form-personal').scrollIntoView({ behavior: 'smooth' });
};

const cancelarEdicionEmpleado = () => {
    editandoEmpleadoId.value = null;
    nuevoEmpleado.value = { user: '', pass: '', rol: 'Vendedor' };
};

const logout = () => { localStorage.clear(); router.push('/login'); };
const volverArriba = () => window.scrollTo({ top: 0, behavior: 'smooth' });

onMounted(() => {
    obtener();
    obtenerEmpleados();
    window.addEventListener('scroll', () => { showScrollBtn.value = window.scrollY > 300; });
});
</script>

<style scoped>
/* Estilos sin cambios significativos, mantenemos la coherencia visual */
.admin-page-wrapper { padding: 110px 0 50px; min-height: 100vh; background-color: #f8fafb; }
.admin-container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
.top-admin-nav { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 30px; border-radius: 20px; margin-bottom: 30px; box-shadow: var(--shadow); }
.user-info { display: flex; align-items: center; gap: 10px; }
.badge-rol { background: var(--primary); color: white; padding: 4px 12px; border-radius: 50px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
.admin-title { font-size: 1.8rem; color: var(--text-dark); margin-bottom: 25px; font-weight: 800; text-align: center; }
.card-subtitle { margin-bottom: 20px; color: var(--text-dark); font-size: 1.2rem; display: flex; align-items: center; gap: 10px; }
.admin-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.full-width { grid-column: span 2; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-muted); font-size: 0.9rem; }
.st-drop-zone { border: 2px dashed #cbd5e1; border-radius: 20px; padding: 40px; text-align: center; cursor: pointer; transition: 0.3s; background: #f8fafc; }
.st-drop-zone.drag-active { border-color: var(--primary); background: #f0fdfa; transform: scale(1.01); }
.icon-folder { font-size: 2.5rem; margin-bottom: 10px; }
.drop-preview { max-height: 300px; width: auto; max-width: 100%; border-radius: 16px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); }
.preview-actions { margin-top: 15px; }
.form-actions { display: flex; gap: 10px; margin-top: 25px; }
.table-responsive { width: 100%; overflow-x: auto; border-radius: 12px; }
.products-table { width: 100%; min-width: 600px; border-collapse: collapse; margin-top: 10px; }
.products-table th { text-align: left; padding: 15px; color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
.products-table td { padding: 15px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
.img-preview { width: 50px; height: 50px; object-fit: cover; border-radius: 12px; background: #eee; }
.btn-edit, .btn-delete { padding: 8px; border-radius: 10px; border: none; cursor: pointer; transition: 0.2s; font-size: 1.1rem; }
.btn-edit { background: #f0fdf4; color: #16a34a; margin-right: 5px; }
.btn-delete { background: #fff1f2; color: #e11d48; }
.personal-card { border-top: 5px solid var(--primary); }
.separator { margin: 40px 0; border: 0; border-top: 1px solid #f1f5f9; }
.password-wrapper { position: relative; }
.btn-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); border: none; background: none; cursor: pointer; font-size: 1.2rem; }
.btn-scroll-top { position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: var(--primary); color: white; border: none; cursor: pointer; opacity: 0; transform: translateY(20px); transition: 0.4s; pointer-events: none; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); z-index: 100; }
.btn-scroll-top.show { opacity: 1; transform: translateY(0); pointer-events: auto; }

@media (max-width: 768px) {
    .admin-page-wrapper { padding: 90px 10px 30px; }
    .top-admin-nav { flex-direction: column; padding: 20px; gap: 15px; }
    .admin-form-grid { grid-template-columns: 1fr; }
    .full-width { grid-column: span 1; }
    .form-actions { flex-direction: column; }
    .st-drop-zone { padding: 20px; }
}

.btn-edit-self { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 8px 16px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 0.85rem; }
.btn-smith-danger { background: #ff4757 !important; color: white !important; border-radius: 12px; padding: 10px 20px; cursor: pointer; border: none; font-weight: bold; }
.btn-smith-primary { background: var(--primary); color: white; }
.btn-smith-outline { border: 1px solid #cbd5e1; background: white; }
.input-smith { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #cbd5e1; }
</style>