// === SECCIÓN 1: CONFIGURACIÓN E IMPORTACIONES ===
const express = require('express');
const router = express.Router();
// Importamos el modelo de Usuario para interactuar con la colección en la base de datos
const Usuario = require('../models/Usuario');

// === SECCIÓN 2: RUTA DE LOGIN (INICIO DE SESIÓN) ===
// Esta ruta verifica si el usuario y la contraseña existen en la base de datos
router.post('/login-db', async (req, res) => {
    // Extraemos las credenciales enviadas desde el frontend
    const { user, pass } = req.body;
    try {
        // Buscamos un usuario que coincida exactamente con el nombre y la clave
        const admin = await Usuario.findOne({ username: user, password: pass });
        
        if (admin) {
            // Si existe, respondemos con los datos necesarios para la sesión
            res.json({
                success: true,
                id: admin._id,
                rol: admin.rol,
                username: admin.username
            });
        } else {
            // Si no coincide, enviamos un error 401 (No autorizado)
            res.status(401).json({ success: false, message: "Usuario o clave incorrectos" });
        }
    } catch (error) {
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