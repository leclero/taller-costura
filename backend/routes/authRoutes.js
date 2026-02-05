const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// LOGIN
router.post('/login-db', async (req, res) => {
const { user, pass } = req.body;
try {
    const admin = await Usuario.findOne({ username: user, password: pass });
    if (admin) {
    res.json({ 
        success: true, 
        id: admin._id,
        rol: admin.rol, 
        username: admin.username 
    });
    } else {
    res.status(401).json({ success: false, message: "Usuario o clave incorrectos" });
    }
} catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
}
});

// OBTENER TODOS LOS USUARIOS (Para la tabla del Admin)
router.get('/users', async (req, res) => {
try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
} catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
}
});

// CREAR USUARIO
router.post('/create-initial', async (req, res) => {
const { username, password, rol } = req.body;
try {
    const existe = await Usuario.findOne({ username });
    if (existe) return res.status(400).json({ error: "El usuario ya existe" });

    const nuevo = new Usuario({ username, password, rol });
    await nuevo.save();
    res.json({ message: "Usuario creado con éxito" });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// EDITAR USUARIO (Cualquiera, por ID)
router.put('/user/:id', async (req, res) => {
const { username, password, rol } = req.body;
try {
    const actualizado = await Usuario.findByIdAndUpdate(req.params.id, {
      username,
      password,
      rol
    }, { new: true });
    res.json(actualizado);
} catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
}
});

// ELIMINAR USUARIO
router.delete('/user/:id', async (req, res) => {
try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado correctamente" });
} catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
}
});

module.exports = router;