const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const verificarToken = require('../middleware/auth');

// Rutas públicas
router.get('/activos', servicioController.listarActivos);
router.get('/:id', servicioController.obtener);

// Rutas protegidas (admin)
router.get('/', verificarToken, servicioController.listar);
router.post('/', verificarToken, servicioController.crear);
router.put('/:id', verificarToken, servicioController.actualizar);
router.delete('/:id', verificarToken, servicioController.eliminar);

module.exports = router;
