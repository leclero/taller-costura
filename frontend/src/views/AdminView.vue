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
            <input v-model="nuevo.nombre" class="custom-input" placeholder="Ej: Vestido" />
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
              <option value="Nuestro Trabajo">Nuestro Trabajo</option>
            </select>
          </div>
          <div class="form-group full-width">
            <div class="st-drop-zone clickable" @click="$refs.fileInput.click()">
              <p v-if="!nuevo.imagenUrl">Haz clic para subir imagen</p>
              <img v-else :src="nuevo.imagenUrl" class="drop-preview" />
              <input type="file" ref="fileInput" @change="handleFileSelect" hidden />
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button @click="guardarProducto" class="btn-publish">{{ editandoId ? 'Actualizar' : 'Publicar' }}</button>
          <button v-if="editandoId" @click="cancelarEdicion" class="btn-cancel">Cancelar</button>
        </div>
      </div>

      <div class="admin-card">
        <h3 class="card-subtitle">📦 Productos</h3>
        <div class="table-responsive">
          <table class="products-table">
            <thead>
              <tr><th>Imagen</th><th>Nombre</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              <tr v-for="p in productos" :key="p._id">
                <td><img :src="p.imagenUrl" class="img-preview" /></td>
                <td>{{ p.nombre }}</td>
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
        <h4 class="card-subtitle">📋 Empleados Registrados</h4>
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
                  <button @click="prepararEdicionEmpleado(user)" class="btn-edit">✏️</button>
                  <button @click="eliminarEmpleado(user._id)" class="btn-delete">🗑️</button>
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

const puedeGestionarPersonal = computed(() => {
  const r = rolActual.value.toLowerCase();
  return r === 'dueño' || r === 'admin';
});

const obtener = async () => {
  try { const res = await axios.get(API_URL); productos.value = res.data; } catch (e) { console.error(e); }
};

const obtenerEmpleados = async () => {
  try { const res = await axios.get(`${AUTH_URL}/users`); listaEmpleados.value = res.data; } catch (e) { console.error(e); }
};

const guardarProducto = async () => {
  try {
    if (editandoId.value) await axios.put(`${API_URL}/${editandoId.value}`, nuevo.value);
    else await axios.post(API_URL, nuevo.value);
    cancelarEdicion(); obtener();
  } catch (e) { alert("Error"); }
};

const crearEmpleado = async () => {
  try {
    await axios.post(`${AUTH_URL}/create-initial`, {
      username: nuevoEmpleado.value.user,
      password: nuevoEmpleado.value.pass,
      rol: nuevoEmpleado.value.rol
    });
    alert("Creado!"); cancelarEdicionEmpleado(); obtenerEmpleados();
  } catch (e) { alert("Error al crear"); }
};

const prepararEdicionEmpleado = (user) => {
  editandoEmpleadoId.value = user._id;
  nuevoEmpleado.value = { user: user.username, pass: user.password, rol: user.rol };
};

const actualizarEmpleado = async () => {
  try {
    await axios.put(`${AUTH_URL}/user/${editandoEmpleadoId.value}`, {
      username: nuevoEmpleado.value.user,
      password: nuevoEmpleado.value.pass,
      rol: nuevoEmpleado.value.rol
    });
    alert("Actualizado"); cancelarEdicionEmpleado(); obtenerEmpleados();
  } catch (e) { alert("Error"); }
};

const eliminarEmpleado = async (id) => {
  if (confirm("¿Eliminar?")) { await axios.delete(`${AUTH_URL}/user/${id}`); obtenerEmpleados(); }
};

const cancelarEdicionEmpleado = () => {
  editandoEmpleadoId.value = null;
  nuevoEmpleado.value = { user: '', pass: '', rol: 'Vendedor' };
};

const cargarEdicion = (p) => { editandoId.value = p._id; nuevo.value = { ...p }; };
const cancelarEdicion = () => { editandoId.value = null; nuevo.value = { nombre: '', precio: 0, categoria: 'Confección', imagenUrl: '' }; };
const eliminar = async (id) => { if(confirm("¿Eliminar?")) { await axios.delete(`${API_URL}/${id}`); obtener(); } };
const logout = () => { localStorage.clear(); router.push('/login'); };

onMounted(() => { obtener(); obtenerEmpleados(); });
</script>

<style scoped>
.admin-page-wrapper { padding: 140px 0 50px; background-color: #f4f7f7; min-height: 100vh; }
.admin-container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
.top-admin-nav { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 25px; border-radius: 15px; margin-bottom: 30px; }
.admin-card { background: white; border-radius: 20px; padding: 30px; margin-bottom: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
.admin-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.full-width { grid-column: span 2; }
.custom-input, .custom-select { width: 100%; padding: 12px; border: 2px solid #edf2f2; border-radius: 12px; }
.password-wrapper { position: relative; }
.btn-eye { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); border: none; background: none; cursor: pointer; }
.products-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
.img-preview { width: 40px; height: 40px; object-fit: cover; border-radius: 8px; }
.badge-rol { background: #e6fffa; color: #004d4d; padding: 3px 8px; border-radius: 5px; font-size: 0.8rem; }
.btn-cancel { background: #eee; border: none; padding: 10px; border-radius: 10px; cursor: pointer; margin-left: 10px; }
.btn-publish, .btn-add-user, .btn-save-config { background: #004d4d; color: white; border: none; padding: 12px 20px; border-radius: 12px; cursor: pointer; font-weight: bold; }
.btn-delete { background: #fff1f1; border: none; cursor: pointer; padding: 5px; border-radius: 5px; }
.btn-edit { background: #f0fff4; border: none; cursor: pointer; padding: 5px; border-radius: 5px; margin-right: 5px; }
</style>