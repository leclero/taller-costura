// === SECCIÓN 1: IMPORTACIÓN DE DEPENDENCIAS ===
// Importamos mongoose para definir la estructura de los usuarios en la base de datos
const mongoose = require('mongoose');

// === SECCIÓN 2: DEFINICIÓN DEL ESQUEMA DE USUARIO ===
// Este esquema controla quién puede entrar al panel de administración y con qué permisos
const usuarioSchema = new mongoose.Schema({
  
  // Nombre de acceso (Ej: 'leclero'). Debe ser obligatorio y no puede repetirse (unique)
  username: { type: String, required: true, unique: true },
  
  // Contraseña encriptada para el acceso al sistema - Es obligatoria
  password: { type: String, required: true },
  
  // Nivel de permisos dentro de la aplicación
  rol: {
    type: String,
    // Lista cerrada de roles permitidos para mayor seguridad
    enum: ['dueño', 'admin', 'Vendedor', 'Ayudante', 'Programador'],
    // Si no se especifica un rol al crear el usuario, se le asigna 'admin' por defecto
    default: 'admin'
  }
});

// === SECCIÓN 3: EXPORTACIÓN DEL MODELO ===
// Creamos el modelo 'Usuario' basado en el esquema y lo exportamos
// Se utilizará principalmente en las rutas de login y registro (authRoutes)
module.exports = mongoose.model('Usuario', usuarioSchema);