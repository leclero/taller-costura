const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // Aquí guardaremos la clave
});

module.exports = mongoose.model('Usuario', usuarioSchema);