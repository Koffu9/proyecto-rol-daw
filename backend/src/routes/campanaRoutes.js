const express = require('express');
const router = express.Router();
const campanaController = require('../controllers/campanaController');
const { verificarToken } = require('../middleware/authMiddleware');

// Todas las rutas de campañas requieren token
router.post('/', verificarToken, campanaController.crearCampana);
router.get('/', verificarToken, campanaController.getCampanas);
router.get('/:id', verificarToken, campanaController.getCampana);
router.put('/:id', verificarToken, campanaController.editarCampana);
router.delete('/:id', verificarToken, campanaController.eliminarCampana);

module.exports = router;