const mongoose = require('mongoose'); // <--- ESTA ES LA LÍNEA QUE FALTA

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { 
    type: String, 
    enum: ['dueño', 'admin', 'Vendedor', 'Ayudante'], 
    default: 'admin' 
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);