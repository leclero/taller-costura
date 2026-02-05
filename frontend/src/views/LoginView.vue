<template>
  <div class="login-page-section">
    <div class="admin-container login-flex">
      
      <div class="smith-login-card">
        
        <div class="login-header-branding">
          <div class="logo-outer-circle">
            <img src="/Smith.jpg" alt="Logo" class="login-logo-img" @error="(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/3064/3064155.png'" />
          </div>
          <h1 class="brand-text">Smith <span>Teilor</span></h1>
          <p class="brand-subtitle">Acceso Administrativo</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label class="login-label">Usuario</label>
            <input 
              v-model="user" 
              type="text" 
              class="custom-input login-input" 
              placeholder="Tu usuario" 
              required 
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label class="login-label">Contraseña</label>
            <div class="password-wrapper">
              <input 
                v-model="pass" 
                :type="showPass ? 'text' : 'password'" 
                class="custom-input login-input" 
                placeholder="••••••••" 
                required 
                :disabled="loading"
              />
              <button type="button" @click="showPass = !showPass" class="btn-eye">
                {{ showPass ? '👁️' : '🙈' }}
              </button>
            </div>
          </div>

          <transition name="fade">
            <div v-if="error" class="login-error-box">
              ⚠️ Usuario o contraseña incorrectos
            </div>
          </transition>

          <button type="submit" class="btn-login-main" :disabled="loading">
            <span v-if="!loading">Entrar al Panel</span>
            <span v-else>Verificando...</span>
          </button>
        </form>

        <div class="login-extra-links">
          <router-link to="/" class="back-link">← Volver a la web</router-link>
        </div>
      </div>

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
    const res = await axios.post('https://api-taller-costura.onrender.com/api/auth/login-db', {
      user: user.value,
      pass: pass.value
    });

    if (res.data.success) {
      // Guardamos la sesión y los datos necesarios para el AdminView
      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('userId', res.data.id);
      localStorage.setItem('userRol', res.data.rol);
      localStorage.setItem('userName', res.data.username);
      
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
/* Contenedor que se adapta bajo el Nav de App.vue */
.login-page-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  padding: 40px 20px;
  background-color: #f8fafb;
}

.login-flex {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* LA TARJETA PREMIUM REDONDEADA */
.smith-login-card {
  max-width: 440px;
  width: 100%;
  padding: 50px 40px;
  background: white;
  border-radius: 45px; /* Bordes muy redondeados según tu imagen */
  box-shadow: 0 20px 60px rgba(0, 77, 77, 0.1);
  text-align: center;
}

.login-header-branding {
  margin-bottom: 35px;
}

.logo-outer-circle {
  width: 90px;
  height: 90px;
  border: 2px solid #004d4d;
  border-radius: 50%;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.login-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-text {
  font-size: 1.8rem;
  font-weight: 800;
  color: #333;
  margin: 0;
}

.brand-text span {
  color: #2ecc71; /* El color verde de Teilor Smith */
}

.brand-subtitle {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 5px;
}

.login-form {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.login-label {
  font-weight: 700;
  color: #475569;
  font-size: 0.85rem;
  margin-bottom: 5px;
  display: block;
  padding-left: 5px;
}

/* Inputs personalizados */
.login-input {
  width: 100%;
  height: 50px;
  border: 2px solid #f1f5f9;
  border-radius: 15px;
  padding: 0 15px;
  box-sizing: border-box;
  transition: 0.3s;
}

.login-input:focus {
  border-color: #2ecc71;
  outline: none;
}

.password-wrapper {
  position: relative;
}

.btn-eye {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

/* Botón principal estilo Smith */
.btn-login-main {
  width: 100%;
  height: 55px;
  background: #004d4d;
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.3s;
}

.btn-login-main:hover:not(:disabled) {
  background: #003333;
  transform: translateY(-2px);
}

.btn-login-main:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.login-error-box {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  text-align: center;
}

.login-extra-links {
  margin-top: 30px;
}

.back-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
}

.back-link:hover {
  color: #004d4d;
}

/* Transición suave para el error */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>