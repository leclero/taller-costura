const express = require('express');
const router = express.Router();
const Prenda = require('../models/Prenda');
const upload = require('../utils/cloudinary');

// --- CREAR PRENDA (POST) ---
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

        const prendaGuardada = await nuevaPrenda.save();
        console.log("✅ Prenda guardada con éxito");
        res.status(201).json(prendaGuardada);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- OBTENER TODAS (GET) ---
router.get('/', async (req, res) => {
    try {
        const prendas = await Prenda.find().sort({ createdAt: -1 });
        res.json(prendas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- MODIFICAR PRENDA (PUT) ---
router.put('/:id', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio, categoria } = req.body;
        let datosActualizados = { nombre, precio, categoria };

        // Si el usuario subió una foto nueva en la edición
        if (req.file) {
            datosActualizados.imagenUrl = req.file.path;
            datosActualizados.formato = req.file.mimetype.startsWith('video') ? 'video' : 'imagen';
        }

        const prendaEditada = await Prenda.findByIdAndUpdate(
            req.params.id,
            datosActualizados,
            { new: true } // Para que devuelva el objeto ya cambiado
        );

        if (!prendaEditada) return res.status(404).json({ message: "No se encontró la prenda" });
        
        console.log("✅ Prenda editada con éxito");
        res.json(prendaEditada);
    } catch (err) {
        console.error("❌ Error al editar:", err.message);
        res.status(500).json({ message: err.message });
    }
});

// --- ELIMINAR PRENDA (DELETE) ---
router.delete('/:id', async (req, res) => {
    try {
        const prendaEliminada = await Prenda.findByIdAndDelete(req.params.id);
        if (!prendaEliminada) return res.status(404).json({ message: "No se encontró la prenda" });
        
        console.log("🗑️ Prenda eliminada con éxito");
        res.json({ message: "Prenda eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;