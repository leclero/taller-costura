<template>
  <nav class="navbar">
    <div class="logo-area">
      <img src="@/assets/Smith.jpg" alt="Smith Logo" class="nav-logo">
      <span class="logo-text">Smith Tailor</span>
    </div>
    <div class="links">
      <a href="#inicio">Inicio</a>
      <a href="#confecciones">Confecciones</a>
      <a href="#reparaciones">Reparaciones</a>
      <a href="#comentarios">Comentarios</a>
      <a href="#contacto">Contacto</a>
      <router-link to="/admin" class="admin-link">Admin</router-link>
    </div>
  </nav>
  <router-view />
</template>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5%;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 77, 77, 0.1);
  position: sticky;
  top: 0;
  z-index: 2000;
}
.logo-area { display: flex; align-items: center; gap: 10px; }
.nav-logo { height: 45px; border-radius: 50%; }
.logo-text { font-weight: 800; color: #004d4d; font-size: 1.2rem; }
.links a {
  margin-left: 20px;
  text-decoration: none;
  font-weight: 600;
  color: #444;
  font-size: 0.9rem;
  transition: 0.3s;
}
.links a:hover { color: #004d4d; }
.admin-link {
  border: 1.5px solid #004d4d;
  padding: 5px 12px !important;
  border-radius: 8px;
}
</style>