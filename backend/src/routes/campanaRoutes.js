const express = require('express');
const router = express.Router();
const campanaController = require('../controllers/campanaController');
const { verificarToken } = require('../middleware/authMiddleware');

// Todas las rutas de campañas requieren token
router.post('/', verificarToken, campanaController.crearCampana);
router.get('/', verificarToken, campanaController.getCampanas);
router.post('/unirse', verificarToken, campanaController.unirseACampana);
router.get('/:id', verificarToken, campanaController.getCampana);
router.put('/:id', verificarToken, campanaController.editarCampana);
router.delete('/:id', verificarToken, campanaController.eliminarCampana);

// Personajes de una campaña
router.get('/:id/personajes', verificarToken, campanaController.getPersonajesDeCampana);
router.post('/:id/personajes', verificarToken, campanaController.asociarPersonaje);
router.delete('/:id/personajes/:id_personaje', verificarToken, campanaController.desasociarPersonaje);

// Participantes de una campaña
router.get('/:id/participantes', verificarToken, campanaController.getParticipantesDeCampana);

// NPCs de una campaña
router.get('/:id/npcs', verificarToken, campanaController.getNpcsDeCampana);
router.post('/:id/npcs', verificarToken, campanaController.crearNpc);
router.put('/:id/npcs/:id_npc/visibilidad', verificarToken, campanaController.toggleVisibilidadNpc);
router.put('/:id/npcs-visibles', verificarToken, campanaController.toggleNpcsVisibles);
router.delete('/:id/npcs/:id_npc', verificarToken, campanaController.eliminarNpc);
router.put('/:id/npcs/:id_npc', verificarToken, campanaController.editarNpc);

module.exports = router;