<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">
          <img src="/Smith.jpg" alt="Logo" class="logo-img" @error="e => e.target.style.display='none'">
          <span class="brand-name">Smith Teilor</span>
        </router-link>

        <div class="nav-links">
          <a href="/#inicio" class="nav-item">Inicio</a>
          <a href="/#confecciones" class="nav-item">Confecciones</a>
          <a href="/#reparaciones" class="nav-item">Reparaciones</a>
          <a href="/#trabajos" class="nav-item">Nuestro Trabajo</a>
          <router-link to="/admin" class="btn-admin-nav">Panel Admin</router-link>
        </div>
      </div>
    </nav>

    <router-view />

    <footer class="main-footer">
      <p>&copy; 2026 Smith Teilor - Luján, Buenos Aires.</p>
    </footer>
  </div>
</template>

<style>
/* Reset básico para que nada se rompa */
body { margin: 0; font-family: 'Inter', sans-serif; background-color: #f8fbfb; color: #333; }
.navbar { background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000; height: 70px; display: flex; align-items: center; }
.nav-container { max-width: 1200px; margin: 0 auto; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
.nav-logo { display: flex; align-items: center; text-decoration: none; gap: 12px; }
.logo-img { height: 45px; width: 45px; border-radius: 50%; object-fit: cover; border: 2px solid #004d4d; }
.brand-name { font-size: 1.4rem; font-weight: 800; color: #004d4d; }
.nav-links { display: flex; align-items: center; gap: 20px; }
.nav-item { text-decoration: none; color: #666; font-weight: 500; font-size: 0.95rem; }
.btn-admin-nav { background: #004d4d; color: white; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; }
.main-footer { text-align: center; padding: 40px 0; color: #888; font-size: 0.9rem; }

@media (max-width: 768px) { .nav-item { display: none; } }
</style>