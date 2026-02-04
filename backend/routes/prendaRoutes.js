const express = require('express');
const router = express.Router();
const Prenda = require('../models/Prenda');
const upload = require('../utils/cloudinary');

// --- CREAR (POST) ---
router.post('/', async (req, res) => {
    try {
        // Ahora buscamos la URL en el body, no en req.file
        if (!req.body.imagenUrl) return res.status(400).json({ message: "Falta la imagen" });
        
        const nuevaPrenda = new Prenda({
            nombre: req.body.nombre,
            precio: req.body.precio,
            categoria: req.body.categoria,
            imagenUrl: req.body.imagenUrl, // Viene del frontend ya subida
            formato: 'imagen' 
        });
        await nuevaPrenda.save();
        res.status(201).json(nuevaPrenda);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- EDITAR (PUT) ---
router.put('/:id', async (req, res) => {
    try {
        // Simplemente actualizamos con lo que venga en el body
        const actualizada = await Prenda.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(actualizada);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;