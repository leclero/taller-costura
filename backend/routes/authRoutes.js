// === SECCIÓN 1: CONFIGURACIÓN E IMPORTACIONES ===
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // <--- NUEVA: Importamos la librería para los tokens
const Usuario = require('../models/Usuario');

// === SECCIÓN 2: RUTA DE LOGIN (INICIO DE SESIÓN) ===
router.post('/login-db', async (req, res) => {
    const { user, pass } = req.body;
    try {
        const admin = await Usuario.findOne({ username: user, password: pass });
        
        if (admin) {
            // --- NUEVO: Generamos el Token aquí ---
            // Usamos la frase secreta de tu .env para "firmar" este pase
            const token = jwt.sign(
                { id: admin._id, rol: admin.rol }, 
                process.env.JWT_SECRET, 
                { expiresIn: '24h' } // El pase dura un día
            );

            // Respondemos enviando el TOKEN al frontend
            res.json({
                success: true,
                token: token,   // <--- ¡Esto es lo que ahora recibirá Vue!
                id: admin._id,
                rol: admin.rol,
                username: admin.username
            });
        } else {
            res.status(401).json({ success: false, message: "Usuario o clave incorrectos" });
        }
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});
// === SECCIÓN 3: GESTIÓN DE USUARIOS (CRUD) ===

// --- OBTENER TODOS LOS USUARIOS ---
// Sirve para mostrar la lista de personal en la tabla del panel administrador
router.get('/users', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

// --- CREAR NUEVO USUARIO ---
// Registra un nuevo integrante (Vendedor, Ayudante, etc.) en el sistema
router.post('/create-initial', async (req, res) => {
    const { username, password, rol } = req.body;
    try {
        // Verificamos primero que el nombre de usuario no esté ocupado
        const existe = await Usuario.findOne({ username });
        if (existe) return res.status(400).json({ error: "El usuario ya existe" });

        // Creamos y guardamos el nuevo registro
        const nuevo = new Usuario({ username, password, rol });
        await nuevo.save();
        res.json({ message: "Usuario creado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- EDITAR USUARIO ---
// Permite modificar los datos de un usuario existente buscando por su ID único
router.put('/user/:id', async (req, res) => {
    const { username, password, rol } = req.body;
    try {
        const actualizado = await Usuario.findByIdAndUpdate(req.params.id, {
            username,
            password,
            rol
        }, { new: true }); // { new: true } devuelve el usuario ya modificado
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
});

// --- ELIMINAR USUARIO ---
// Quita a un usuario del sistema definitivamente
router.delete('/user/:id', async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

// === SECCIÓN 4: EXPORTACIÓN ===
// Exportamos el router para que server.js pueda usar estas rutas bajo el prefijo /api/auth
module.exports = router;