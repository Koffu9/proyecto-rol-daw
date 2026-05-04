const express = require('express');
const router = express.Router();
const personajeController = require('../controllers/personajeController');
const { verificarToken } = require('../middleware/authMiddleware');

// Obtener todos los sistemas disponibles
router.get('/sistemas', verificarToken, personajeController.getSistemas);

// CRUD de personajes
router.get('/', verificarToken, personajeController.getPersonajes);
router.get('/:id', verificarToken, personajeController.getPersonaje);
router.post('/', verificarToken, personajeController.crearPersonaje);
router.put('/:id', verificarToken, personajeController.editarPersonaje);
router.put('/:id/subir-nivel', verificarToken, personajeController.subirNivel);
router.delete('/:id', verificarToken, personajeController.eliminarPersonaje);

module.exports = router;