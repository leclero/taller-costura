// === SECCIÓN 1: IMPORTACIÓN DE LIBRERÍAS CORE ===
// Importamos la función que da vida a Vue
import { createApp } from 'vue'
// Pinia es el almacén central donde guardamos datos que todos los componentes necesitan
import { createPinia } from 'pinia'

// === SECCIÓN 2: IMPORTACIÓN DE COMPONENTES Y CONFIGURACIÓN ===
// App.vue es el "cascarón" donde se cargarán todas las vistas (Login, Admin, etc.)
import App from '@/App.vue'
// Importamos la configuración del Router que define qué dirección (URL) muestra qué vista
import router from './router'

// === SECCIÓN 3: IMPORTACIÓN DE ESTILOS ===
// Importamos el archivo CSS principal que da el look & feel a toda la web
import '@/assets/main.css'

// === SECCIÓN 4: INICIALIZACIÓN Y MONTAJE ===

// 1. Iniciamos la aplicación tomando App.vue como punto de partida
const app = createApp(App)

// 2. Le decimos a Vue que use Pinia para la gestión de estados globales
app.use(createPinia())

// 3. Le decimos a Vue que use el Router para manejar la navegación
app.use(router)

/* 4. MONTAJE FINAL:
Buscamos el div con id "app" en el index.html y volcamos toda la 
aplicación de Vue dentro de él.
*/
app.mount('#app')