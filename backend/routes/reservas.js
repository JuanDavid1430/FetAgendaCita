const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const verificarToken = require('../middleware/auth');

// Rutas públicas
router.post('/', reservaController.crear);
router.get('/disponibilidad', reservaController.obtenerDisponibilidad);

// Rutas protegidas (admin)
router.get('/', verificarToken, reservaController.listar);
router.get('/estadisticas', verificarToken, reservaController.estadisticas);
router.get('/:id', verificarToken, reservaController.obtener);
router.put('/:id/estado', verificarToken, reservaController.actualizarEstado);
router.put('/:id/cancelar', verificarToken, reservaController.cancelar);

module.exports = router;
