const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Ruta para cambiar usuario y clave
router.put('/update-admin', async (req, res) => {
const { nuevoUsuario, nuevaPass } = req.body;
try {
    // Buscamos el único usuario que habrá (o lo creamos si no existe)
    let admin = await Usuario.findOne();
    
    if (admin) {
    admin.username = nuevoUsuario;
    admin.password = nuevaPass;
    await admin.save();
    } else {
    admin = new Usuario({ username: nuevoUsuario, password: nuevaPass });
    await admin.save();
    }
    res.json({ message: "Datos actualizados correctamente" });
} catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
}
});

// Ruta para que el Login consulte a la DB
router.post('/login-db', async (req, res) => {
const { user, pass } = req.body;
const admin = await Usuario.findOne({ username: user, password: pass });

if (admin) {
    res.json({ success: true });
} else {
    res.status(401).json({ success: false, message: "Incorrecto" });
}
});

module.exports = router;