const express = require('express');
const router = express.Router();
const Prenda = require('../models/Prenda');
const upload = require('../utils/cloudinary');

router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Falta la imagen" });

        const nuevaPrenda = new Prenda({
            nombre: req.body.nombre,
            precio: req.body.precio,
            categoria: req.body.categoria || req.body.tipo,
            imagenUrl: req.file.path,
            formato: req.file.mimetype.startsWith('video') ? 'video' : 'imagen'
        });

        await nuevaPrenda.save();
        res.status(201).json(nuevaPrenda);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const prendas = await Prenda.find().sort({ createdAt: -1 });
        res.json(prendas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;