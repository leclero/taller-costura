// === SECCIÓN 1: CONFIGURACIÓN E IMPORTACIONES ===
const express = require('express');
const router = express.Router();
// Importamos el modelo de Prenda para interactuar con la colección en la base de datos
const Prenda = require('../models/Prenda');

// === SECCIÓN 2: OPERACIONES DEL CATÁLOGO (CRUD) ===

// --- LEER TODAS LAS PRENDAS (GET) ---
// Esta ruta obtiene la lista completa para mostrarla en el inicio y en el panel
router.get('/', async (req, res) => {
    try {
        // Buscamos todas las prendas y las ordenamos por fecha (la más nueva primero)
        const prendas = await Prenda.find().sort({ createdAt: -1 });
        res.json(prendas);
    } catch (err) {
        // Error 500: Falla en la comunicación con la base de datos
        res.status(500).json({ message: err.message });
    }
});

// --- CREAR UNA NUEVA PRENDA (POST) ---
// Recibe los datos del formulario de "Agregar Producto" y los guarda en la nube
router.post('/', async (req, res) => {
    try {
        // Validación de seguridad: verificamos que se haya subido una imagen
        if (!req.body.imagenUrl) {
            return res.status(400).json({ message: "Falta la imagen" });
        }

        // Creamos la instancia del nuevo producto con los datos recibidos
        const nuevaPrenda = new Prenda({
            nombre: req.body.nombre,
            precio: req.body.precio,
            categoria: req.body.categoria,
            imagenUrl: req.body.imagenUrl,
            formato: 'imagen' // Por defecto se define como imagen
        });

        // Guardamos en MongoDB Atlas
        await nuevaPrenda.save();
        // Respondemos con el objeto creado y código 201 (Creado con éxito)
        res.status(201).json(nuevaPrenda);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- EDITAR UNA PRENDA EXISTENTE (PUT) ---
// Recibe el ID de la prenda por URL y los nuevos datos por el cuerpo (body)
router.put('/:id', async (req, res) => {
    try {
        const actualizada = await Prenda.findByIdAndUpdate(
            req.params.id, // ID extraído de la ruta
            req.body,      // Nuevos datos (precio, nombre, etc.)
            { new: true }  // Esta opción hace que nos devuelva el objeto ya actualizado
        );
        res.json(actualizada);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ELIMINAR UNA PRENDA (DELETE) ---
// Borra definitivamente un producto del catálogo usando su ID
router.delete('/:id', async (req, res) => {
    try {
        await Prenda.findByIdAndDelete(req.params.id);
        res.json({ message: "Producto eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// === SECCIÓN 3: EXPORTACIÓN ===
// Exportamos el router para que sea utilizado en server.js bajo /api/prendas
module.exports = router;