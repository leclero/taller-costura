const express = require('express');
const router = express.Router();
const Prenda = require('../models/Prenda');
const upload = require('../utils/cloudinary');

// --- CREAR (POST) ---
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Falta la imagen" });
        const nuevaPrenda = new Prenda({
            nombre: req.body.nombre,
            precio: req.body.precio,
            categoria: req.body.categoria,
            imagenUrl: req.file.path,
            formato: req.file.mimetype.startsWith('video') ? 'video' : 'imagen'
        });
        await nuevaPrenda.save();
        res.status(201).json(nuevaPrenda);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- LEER TODAS (GET) ---
router.get('/', async (req, res) => {
    try {
        const prendas = await Prenda.find().sort({ createdAt: -1 });
        res.json(prendas);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- EDITAR (PUT) ---
router.put('/:id', upload.single('imagen'), async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (req.file) {
            updateData.imagenUrl = req.file.path;
            updateData.formato = req.file.mimetype.startsWith('video') ? 'video' : 'imagen';
        }
        const actualizada = await Prenda.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(actualizada);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- ELIMINAR (DELETE) ---
router.delete('/:id', async (req, res) => {
    try {
        await Prenda.findByIdAndDelete(req.params.id);
        res.json({ message: "Eliminado" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;