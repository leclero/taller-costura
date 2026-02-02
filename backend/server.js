const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prendaRoutes = require('./routes/prendaRoutes');

// 1. Middlewares (ORDEN CRÍTICO)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Conexión BD
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🧵 Conectado a MongoDB"))
    .catch(err => console.error("❌ Error BD:", err));

// 3. Rutas
app.use('/api/prendas', prendaRoutes);

app.get('/', (req, res) => res.send("API Funcionando 🪡"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Puerto: ${PORT}`));