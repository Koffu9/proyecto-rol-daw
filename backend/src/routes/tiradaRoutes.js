const express = require('express');
const router = express.Router();
const tiradaController = require('../controllers/tiradaController');
const { verificarToken } = require('../middleware/authMiddleware');

// Realizar una tirada y guardarla
router.post('/', verificarToken, tiradaController.realizarTirada);

// Historial de tiradas del usuario
router.get('/usuario', verificarToken, tiradaController.getTiradasUsuario);

// Historial de tiradas de una campaña
router.get('/campana/:id', verificarToken, tiradaController.getTiradasCampana);

module.exports = router;