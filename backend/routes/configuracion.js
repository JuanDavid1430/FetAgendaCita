const express = require('express');
const router = express.Router();
const configuracionController = require('../controllers/configuracionController');
const verificarToken = require('../middleware/auth');

// Todas las rutas de configuración requieren autenticación

// Horarios de trabajo
router.get('/horarios', verificarToken, configuracionController.listarHorarios);
router.put('/horarios/:dia_semana', verificarToken, configuracionController.actualizarHorario);

// Días bloqueados
router.get('/dias-bloqueados', verificarToken, configuracionController.listarDiasBloqueados);
router.post('/dias-bloqueados', verificarToken, configuracionController.crearDiaBloqueado);
router.delete('/dias-bloqueados/:id', verificarToken, configuracionController.eliminarDiaBloqueado);

module.exports = router;
