const mongoose = require('mongoose');

const PrendaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipo: { type: String, enum: ['Arreglo', 'Confección', 'Venta'], default: 'Venta' },
    precio: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    descripcion: String
});

module.exports = mongoose.model('Prenda', PrendaSchema);