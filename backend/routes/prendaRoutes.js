const express = require('express');
const router = express.Router();
const Prenda = require('../models/Prenda');

// --- LEER TODAS (GET) ---
// Esta es la ruta que te estaba faltando y por eso veías el 404
router.get('/', async (req, res) => {
    try {
        const prendas = await Prenda.find().sort({ createdAt: -1 });
        res.json(prendas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- CREAR (POST) ---
router.post('/', async (req, res) => {
    try {
        if (!req.body.imagenUrl) {
            return res.status(400).json({ message: "Falta la imagen" });
        }

        const nuevaPrenda = new Prenda({
            nombre: req.body.nombre,
            precio: req.body.precio,
            categoria: req.body.categoria,
            imagenUrl: req.body.imagenUrl,
            formato: 'imagen'
        });

        await nuevaPrenda.save();
        res.status(201).json(nuevaPrenda);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- EDITAR (PUT) ---
router.put('/:id', async (req, res) => {
    try {
        const actualizada = await Prenda.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(actualizada);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ELIMINAR (DELETE) ---
router.delete('/:id', async (req, res) => {
    try {
        await Prenda.findByIdAndDelete(req.params.id);
        res.json({ message: "Producto eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;