const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { 
    type: String, 
    // Añadimos los nuevos roles aquí
    enum: ['dueño', 'admin', 'Vendedor', 'Ayudante'], 
    default: 'admin' 
  }
});