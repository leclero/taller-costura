const mongoose = require('mongoose');

const PrendaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    imagenUrl: { type: String, required: true },
    formato: { type: String, default: 'imagen' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prenda', PrendaSchema);