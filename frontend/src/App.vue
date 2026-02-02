<template>
  <nav class="navbar">
    <div class="logo">🪡 Taller de Costura</div>
    <div class="links">
      <router-link to="/">Inicio</router-link>
      <router-link to="/admin" class="admin-link">Administración</router-link>
    </div>
  </nav>

  <router-view />
</template>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.logo { font-weight: bold; font-size: 1.5rem; color: #ff69b4; }
.links a {
  margin-left: 20px;
  font-weight: 500;
  color: #555;
  transition: color 0.3s;
}
.links a:hover, .router-link-active { color: #ff69b4; }
.admin-link {
  border: 1px solid #ff69b4;
  padding: 5px 15px;
  border-radius: 5px;
}
</style>