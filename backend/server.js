const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const prendaRoutes = require('./routes/prendaRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/prendas', prendaRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🧵 Conectado a la base de datos del taller"))
    .catch(err => console.error("Error de conexión:", err));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send("API del Taller de Costura funcionando 🪡");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});