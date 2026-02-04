const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// LOGIN: Devuelve ID, ROL y USERNAME
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

// ACTUALIZAR MI PROPIO PERFIL
// Solo permite el cambio si el ID que se quiere editar es el MISMO del que está logueado
router.put('/update-profile/:id', async (req, res) => {
const { nuevoUsuario, nuevaPass, solicitanteId } = req.body;
const targetId = req.params.id;

if (solicitanteId !== targetId) {
    return res.status(403).json({ error: "No puedes modificar los datos de otro administrador" });
}

try {
    const actualizado = await Usuario.findByIdAndUpdate(targetId, {
    username: nuevoUsuario,
    password: nuevaPass
    }, { new: true });

    res.json({ message: "Tus datos han sido actualizados", user: actualizado.username });
} catch (error) {
    res.status(500).json({ error: "Error al actualizar tu perfil" });
}
});

// RUTA PARA CREAR EL SEGUNDO ADMINISTRADOR (Solo temporal o inicial)
router.post('/create-initial', async (req, res) => {
const { username, password, rol } = req.body;
try {
    const nuevo = new Usuario({ username, password, rol });
    await nuevo.save();
    res.json({ message: "Usuario creado con éxito" });
} catch (error) {
    res.status(500).json({ error: "Error: El usuario ya existe" });
}
});

module.exports = router;