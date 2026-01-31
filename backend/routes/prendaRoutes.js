const express = require('express');
const router = express.Router();
const Prenda = require('../models/Prenda');

// OBTENER TODAS LAS PRENDAS
router.get('/', async (req, res) => {
    try {
        const prendas = await Prenda.find();
        res.json(prendas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREAR UNA NUEVA PRENDA
router.post('/', async (req, res) => {
    const prenda = new Prenda({
        nombre: req.body.nombre,
        tipo: req.body.tipo,
        precio: req.body.precio,
        stock: req.body.stock,
        descripcion: req.body.descripcion
    });

    try {
        const nuevaPrenda = await prenda.save();
        res.status(201).json(nuevaPrenda);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;