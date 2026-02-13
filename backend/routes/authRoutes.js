// === SECCIÓN 1: CONFIGURACIÓN E IMPORTACIONES ===
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // <--- NUEVA: Importamos la librería para los tokens
const Usuario = require('../models/Usuario');

// === SECCIÓN 2: RUTA DE LOGIN (INICIO DE SESIÓN) ===
router.post('/login-db', async (req, res) => {
    try {
        const { user, pass } = req.body;
        console.log("--> Intento de login para:", user);

        // 1. Validar conexión con la base de datos
        const admin = await Usuario.findOne({ 
            username: user.trim(), 
            password: pass.trim() 
        });

        if (!admin) {
            return res.status(401).json({ success: false, message: "Credenciales inválidas" });
        }

        // 2. Validar que la librería JWT esté cargada
        if (typeof jwt.sign !== 'function') {
            throw new Error("La librería jsonwebtoken no está cargada correctamente");
        }

        // 3. Validar la clave secreta
        const secret = process.env.JWT_SECRET || "CLAVE_DE_EMERGENCIA_BORRAR_LUEGO";
        if (!process.env.JWT_SECRET) {
            console.warn("⚠️ Usando clave de emergencia. Revisa las variables de Render.");
        }

        // 4. Firmar Token
        const token = jwt.sign(
            { id: admin._id, rol: admin.rol }, 
            secret, 
            { expiresIn: '24h' }
        );

        return res.json({
            success: true,
            token,
            id: admin._id,
            rol: admin.rol,
            username: admin.username
        });

    } catch (error) {
        console.error("❌ ERROR CRÍTICO:", error.message);
        // Esto enviará el detalle real a tu consola de Vue
        return res.status(500).json({ 
            error: "Error en el servidor", 
            detalle: error.message 
        });
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