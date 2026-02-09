// === SECCIÓN 1: IMPORTACIÓN DE MOTORES Y HERRAMIENTAS ===
const express = require('express');   // El framework principal para crear el servidor
const mongoose = require('mongoose'); // La herramienta para conectarse a MongoDB
const cors = require('cors');         // Permite que tu Frontend (Vercel) hable con tu Backend (Render)
require('dotenv').config();           // Carga tus claves secretas (MONGO_URI, etc.) desde el archivo .env

const app = express(); // Inicializamos la aplicación de Express

// === SECCIÓN 2: IMPORTACIÓN DE RUTAS ===
// Traemos la lógica de Prendas y de Usuarios que definimos en la carpeta 'routes'
const prendaRoutes = require('./routes/prendaRoutes');
const authRoutes = require('./routes/authRoutes');

// === SECCIÓN 3: MIDDLEWARES (Configuraciones de Seguridad y Datos) ===
// El orden aquí es crítico para que el servidor entienda lo que le envían
app.use(cors());                         // Habilita el intercambio de datos entre distintos dominios
app.use(express.json());                 // Permite que el servidor entienda formato JSON
app.use(express.urlencoded({ extended: true })); // Permite entender datos de formularios complejos

// === SECCIÓN 4: CONEXIÓN A LA BASE DE DATOS ===
// Usamos la dirección secreta guardada en las variables de entorno
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🧵 Conectado a MongoDB")) // Si todo sale bien, vemos el hilo
    .catch(err => console.error("❌ Error BD:", err)); // Si falla, nos avisa con una cruz

// === SECCIÓN 5: DEFINICIÓN DE PUNTOS DE ACCESO (ENDPOINTS) ===
// Aquí conectamos las URLs con su lógica correspondiente
app.use('/api/prendas', prendaRoutes); // Todo lo que empiece con /api/prendas va a prendaRoutes
app.use('/api/auth', authRoutes);     // Todo lo que empiece con /api/auth va a authRoutes

// Ruta de prueba para verificar que el servidor está "vivo" al entrar a la URL principal
app.get('/', (req, res) => res.send("API Funcionando 🪡"));

// === SECCIÓN 6: ARRANQUE DEL SERVIDOR ===
// Definimos el puerto (el 5000 por defecto o el que asigne el servidor en la nube)
const PORT = process.env.PORT || 5000;

// Escuchamos pedidos en la dirección '0.0.0.0' para que sea accesible desde internet
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Puerto: ${PORT}`);
});