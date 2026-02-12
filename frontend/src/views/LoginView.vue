<template>
    <div class="login-page-wrapper">
        <div class="admin-container">
            
            <div class="card-smith login-card">
                <div class="login-header-branding">
                    <div class="logo-outer-circle">
                        <img src="/Smith.jpg" alt="Logo" class="login-logo-img"
                            @error="(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/3064/3064155.png'" />
                    </div>
                    <h1 class="brand-text">Teilor <span>Smith</span></h1>
                    <p class="brand-subtitle">Acceso Administrativo</p>
                </div>

                <form @submit.prevent="handleLogin" class="admin-form-grid">
                    <div class="form-group full-width">
                        <label class="login-label">Usuario</label>
                        <input v-model="user" type="text" class="input-smith" placeholder="Tu usuario"
                            required :disabled="loading" />
                    </div>

                    <div class="form-group full-width">
                        <label class="login-label">Contraseña</label>
                        <div class="password-wrapper">
                            <input v-model="pass" :type="showPass ? 'text' : 'password'"
                                class="input-smith" placeholder="••••••••" required :disabled="loading" />
                            <button type="button" @click="showPass = !showPass" class="btn-eye">
                                {{ showPass ? '👁️' : '🙈' }}
                            </button>
                        </div>
                    </div>

                    <transition name="fade">
                        <div v-if="error" class="login-error-box full-width">
                            ⚠️ Usuario o contraseña incorrectos
                        </div>
                    </transition>

                    <button type="submit" class="btn-smith btn-smith-primary full-width" :disabled="loading" style="height: 55px;">
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
            localStorage.setItem('isLogged', 'true');
            localStorage.setItem('userToken', res.data.token);
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
/* Contenedor principal */
.login-page-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 80px); /* Ajuste para que no se pegue al borde */
    background-color: #f8fafb;
    padding: 20px;
}

.login-card {
    max-width: 440px;
    margin: 0 auto;
    padding: 50px 40px;
    text-align: center;
}

/* Branding */
.logo-outer-circle {
    width: 90px;
    height: 90px;
    border: 2px solid var(--primary);
    border-radius: 50%;
    margin: 0 auto 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.login-logo-img { width: 100%; height: 100%; object-fit: cover; }
.brand-text { font-size: 1.8rem; font-weight: 800; color: var(--text-dark); margin: 0; }
.brand-text span { color: #2ecc71; }
.brand-subtitle { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 30px; }

/* Password visibility */
.password-wrapper { position: relative; }
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

/* Error feedback */
.login-error-box {
    background-color: #fef2f2;
    color: #dc2626;
    padding: 12px;
    border-radius: 12px;
    font-weight: 700;
    margin: 10px 0;
}

.login-extra-links { margin-top: 30px; }
.back-link { color: var(--text-muted); text-decoration: none; font-weight: 600; transition: 0.3s; }
.back-link:hover { color: var(--primary); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>