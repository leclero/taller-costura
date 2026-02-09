// === SECCIÓN 1: IMPORTACIÓN DE DEPENDENCIAS ===
// Importamos mongoose para poder interactuar con la base de datos MongoDB
const mongoose = require('mongoose');

// === SECCIÓN 2: DEFINICIÓN DEL ESQUEMA (MODELO DE DATOS) ===
// Aquí definimos qué "forma" tendrá la información de cada prenda en la base de datos
const PrendaSchema = new mongoose.Schema({
    // El nombre del artículo (Ej: "Guardapolvo escolar") - Es obligatorio
    nombre: { type: String, required: true },
    
    // El costo del trabajo o producto - Es obligatorio y debe ser un número
    precio: { type: Number, required: true },
    
    // El grupo al que pertenece (Ej: "Hogar", "Escolar", "Arreglo") - Es obligatorio
    categoria: { type: String, required: true },
    
    // La dirección web (link) de la foto guardada en Cloudinary - Es obligatorio
    imagenUrl: { type: String, required: true },
    
    // Define si es imagen o video (por defecto se guarda como 'imagen')
    formato: { type: String, default: 'imagen' },
    
    // Fecha en la que se creó el registro (se genera automáticamente)
    createdAt: { type: Date, default: Date.now }
});

// === SECCIÓN 3: EXPORTACIÓN DEL MODELO ===
// Convertimos el esquema en un "Modelo" llamado 'Prenda' y lo exportamos
// Esto permite que otros archivos del backend puedan crear, borrar o editar prendas
module.exports = mongoose.model('Prenda', PrendaSchema);