const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/', verificarToken, perfilController.getPerfil);
router.put('/imagen', verificarToken, perfilController.updateImagenPerfil);
router.put('/password', verificarToken, perfilController.updatePassword);

module.exports = router;