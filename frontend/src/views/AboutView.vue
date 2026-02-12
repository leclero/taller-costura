<template>
  <div class="about">
    <h1>This is an about page</h1>
    </div>
</template>

<script setup>
// Actualmente no requiere lógica de JavaScript
</script>

<style>
/* === ESTILOS PARA PANTALLAS GRANDES === */
@media (min-width: 1024px) {
  .about {
    /* Asegura que la sección ocupe toda la altura de la pantalla */
    min-height: 100vh;
    /* Centra el contenido verticalmente */
    display: flex;
    align-items: center;
    padding: 0 40px;
  }
}

/* Estilos para móviles (por debajo de 1024px) */
@media (max-width: 1023px) {
  .about {
    padding: 100px 20px; /* Espacio para que no choque con la Navbar */
    text-align: center;
  }
}
</style>