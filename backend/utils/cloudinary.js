// === SECCIÓN 1: IMPORTACIÓN DE HERRAMIENTAS ===
// SDK de Cloudinary para conectarnos con su servicio de almacenamiento
const cloudinary = require('cloudinary').v2;
// Complemento para que Multer (el gestor de archivos) sepa hablar con Cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// Librería principal para gestionar la subida de archivos (imágenes/videos)
const multer = require('multer');

// === SECCIÓN 2: CONFIGURACIÓN DE CREDENCIALES ===
// Usamos las llaves maestras que guardaste en el archivo .env para identificarnos
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// === SECCIÓN 3: CONFIGURACIÓN DEL ALMACENAMIENTO ===
// Definimos las reglas de cómo y dónde se guardarán los archivos
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        // Nombre de la carpeta que se creará en tu panel de Cloudinary
        folder: 'taller-costura',
        // Formatos de archivo permitidos para evitar archivos dañinos
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4'],
        // 'auto' detecta automáticamente si estás subiendo una foto o un video
        resource_type: 'auto' 
    }
});

// === SECCIÓN 4: CREACIÓN DEL MOTOR DE SUBIDA ===
// Creamos la función 'upload' que usaremos en las rutas para procesar las imágenes
const upload = multer({ storage: storage });

// === SECCIÓN 5: EXPORTACIÓN ===
// Exportamos el motor configurado para usarlo, por ejemplo, al crear una prenda
module.exports = upload;