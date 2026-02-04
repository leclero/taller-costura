<template>
<div class="login-wrapper">
    <div class="login-card">
    <div class="logo-area">
        <img src="/Smith.jpg" alt="Logo" class="login-logo" @error="e => e.target.style.display='none'">
        <h2>Smith <span class="accent">Teilor</span></h2>
        <p class="subtitle">Acceso Administrativo</p>
    </div>
    
    <form @submit.prevent="handleLogin">
        <div class="form-group">
        <label>Usuario</label>
        <input v-model="user" type="text" placeholder="Tu usuario" required class="custom-input" />
        </div>
        <div class="form-group">
        <label>Contraseña</label>
        <div class="password-wrapper">
            <input 
            :type="showPass ? 'text' : 'password'" 
            v-model="pass" 
            placeholder="••••••••" 
            required 
            class="custom-input" 
            />
            <button type="button" @click="showPass = !showPass" class="btn-eye">
            {{ showPass ? '👁️' : '🙈' }}
            </button>
        </div>
        </div>
        <p v-if="error" class="error-msg">⚠️ Usuario o contraseña incorrectos</p>
        <button type="submit" class="btn-login" :disabled="loading">
        {{ loading ? 'Verificando...' : 'Entrar al Panel' }}
        </button>
    </form>
    
    <router-link to="/" class="btn-back">⬅ Volver a la web</router-link>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const user = ref('');
const pass = ref('');
const error = ref(false);
const loading = ref(false);
const showPass = ref(false);
const router = useRouter();

const handleLogin = async () => {
error.value = false;
loading.value = true;

try {
    // Llamamos a la nueva ruta que creamos en el backend
    const res = await axios.post('https://api-taller-costura.onrender.com/api/auth/login-db', {
    user: user.value,
    pass: pass.value
    });

    if (res.data.success) {
    localStorage.setItem('isLogged', 'true');
    router.push('/admin');
    }
} catch (err) {
    error.value = true;
    pass.value = '';
    console.error("Error de login:", err.response?.data || err.message);
} finally {
    loading.value = false;
}
};
</script>

<style scoped>
.login-wrapper { 
min-height: 100vh; 
display: flex; 
align-items: center; 
justify-content: center; 
background: #f0f4f4; 
padding: 20px; 
box-sizing: border-box;
}
.login-card { 
background: white; 
padding: 40px; 
border-radius: 24px; 
box-shadow: 0 10px 40px rgba(0,0,0,0.1); 
width: 100%; 
max-width: 400px; 
text-align: center; 
}
.login-logo { width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px; border: 3px solid #004d4d; object-fit: cover; }
.accent { color: #25d366; }
.subtitle { color: #666; margin-bottom: 30px; font-weight: 600; }
.form-group { text-align: left; margin-bottom: 20px; }
label { display: block; font-weight: 700; margin-bottom: 8px; color: #444; font-size: 0.9rem; }

/* PASSWORD WRAPPER */
.password-wrapper { position: relative; display: flex; align-items: center; }
.btn-eye { position: absolute; right: 15px; background: none; border: none; cursor: pointer; font-size: 1.2rem; z-index: 10; }

.custom-input { 
width: 100%; 
padding: 12px; 
  padding-right: 45px; /* Espacio para el ojo */
border-radius: 12px; 
border: 2px solid #edf2f2; 
outline: none; 
transition: 0.3s; 
box-sizing: border-box; 
}
.custom-input:focus { border-color: #25d366; }

.btn-login { 
width: 100%; 
background: #004d4d; 
color: white; 
border: none; 
padding: 15px; 
border-radius: 12px; 
font-weight: 800; 
cursor: pointer; 
margin-top: 10px; 
transition: 0.3s; 
}
.btn-login:hover:not(:disabled) { background: #003333; transform: translateY(-2px); }
.btn-login:disabled { background: #ccc; cursor: not-allowed; }

.error-msg { color: #e53e3e; font-size: 0.85rem; margin-bottom: 15px; font-weight: bold; }
.btn-back { display: block; margin-top: 25px; color: #888; text-decoration: none; font-size: 0.9rem; font-weight: 600; }

@media (max-width: 480px) {
.login-card { padding: 30px 20px; }
}
</style>