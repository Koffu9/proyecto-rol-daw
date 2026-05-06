const campanaModel = require('../models/campanaModel');
const { v4: uuidv4 } = require('uuid');

// Crea una nueva campaña y añade al creador como máster en la tabla participa
const crearCampana = async (req, res) => {
    const { titulo, descripcion, mapa_url } = req.body;
    const id_master = req.usuario.id;
    console.log('Body recibido:', req.body);
    console.log('mapa_url:', mapa_url);
    try {
        const codigo_invitacion = uuidv4().slice(0, 8).toUpperCase();

        const result = await campanaModel.crearCampana(titulo, descripcion, codigo_invitacion, id_master, mapa_url);
        const id_campana = result.insertId;

        await campanaModel.agregarParticipante(id_campana, id_master, 'master');

        res.status(201).json({ mensaje: 'Campaña creada correctamente', id: id_campana, codigo_invitacion });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtiene todas las campañas del usuario autenticado
const getCampanas = async (req, res) => {
    const id_usuario = req.usuario.id;

    try {
        const campanas = await campanaModel.getCampanasByUsuario(id_usuario);
        res.json(campanas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtiene el detalle de una campaña por id
const getCampana = async (req, res) => {
    const { id } = req.params;
    const id_usuario = req.usuario.id;

    try {
        const campana = await campanaModel.getCampanaById(id);
        if (!campana) return res.status(404).json({ error: 'Campaña no encontrada' });

        // Verificamos que el usuario es participante o es el master
        const yaParticipa = await campanaModel.isParticipante(id, id_usuario);
        if (!yaParticipa) return res.status(403).json({ error: 'No tienes acceso a esta campaña' });

        res.json(campana);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Edita una campaña, solo si el usuario es el máster
const editarCampana = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, npcs_visibles, mapa_url } = req.body;
    const id_usuario = req.usuario.id;

    try {
        const campana = await campanaModel.getCampanaById(id);
        if (!campana) return res.status(404).json({ error: 'Campaña no encontrada' });
        if (campana.id_master !== id_usuario) return res.status(403).json({ error: 'No tienes permisos para editar esta campaña' });

        await campanaModel.editarCampana(id, titulo, descripcion, npcs_visibles ?? campana.npcs_visibles, mapa_url ?? campana.mapa_url);
        res.json({ mensaje: 'Campaña editada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Elimina una campaña, solo si el usuario es el máster
const eliminarCampana = async (req, res) => {
    const { id } = req.params;
    const id_usuario = req.usuario.id;

    try {
        const campana = await campanaModel.getCampanaById(id);
        if (!campana) return res.status(404).json({ error: 'Campaña no encontrada' });
        if (campana.id_master !== id_usuario) return res.status(403).json({ error: 'No tienes permisos para eliminar esta campaña' });

        await campanaModel.eliminarCampana(id);
        res.json({ mensaje: 'Campaña eliminada correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Unirse a una campaña mediante código de invitación
const unirseACampana = async (req, res) => {
    const { codigo } = req.body;
    const id_usuario = req.usuario.id;

    try {
        // Buscamos la campaña por el código
        const campana = await campanaModel.getCampanaByCodigoInvitacion(codigo);
        if (!campana) return res.status(404).json({ error: 'Código de invitación no válido' });

        // Comprobamos que el usuario no sea ya participante
        const yaParticipa = await campanaModel.isParticipante(campana.id, id_usuario);
        if (yaParticipa) return res.status(400).json({ error: 'Ya eres participante de esta campaña' });

        // Comprobamos que el usuario no sea el master
        if (campana.id_master === id_usuario) return res.status(400).json({ error: 'Ya eres el máster de esta campaña' });

        // Añadimos al usuario como jugador
        await campanaModel.agregarParticipante(campana.id, id_usuario, 'jugador');

        res.status(201).json({ mensaje: 'Te has unido a la campaña correctamente', campana });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtiene todos los participantes de una campaña
const getParticipantesDeCampana = async (req, res) => {
    const { id } = req.params;
    try {
        const participantes = await campanaModel.getParticipantesByCampana(id);
        res.json(participantes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtiene todos los personajes de una campaña
const getPersonajesDeCampana = async (req, res) => {
    const { id } = req.params;
    try {
        const personajes = await campanaModel.getPersonajesByCampana(id);
        res.json(personajes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Asocia un personaje del usuario a una campaña
const asociarPersonaje = async (req, res) => {
    const { id } = req.params;
    const { id_personaje } = req.body;
    const id_usuario = req.usuario.id;

    try {
        // Comprobamos que el usuario participa en la campaña
        const yaParticipa = await campanaModel.isParticipante(id, id_usuario);
        if (!yaParticipa) return res.status(403).json({ error: 'No eres participante de esta campaña' });

        await campanaModel.asociarPersonajeACampana(id_personaje, id);
        res.json({ mensaje: 'Personaje asociado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Desasocia un personaje de una campaña
const desasociarPersonaje = async (req, res) => {
    const { id_personaje } = req.params;
    const id_usuario = req.usuario.id;

    try {
        // Comprobamos que el personaje pertenece al usuario
        const personaje = await campanaModel.getPersonajeById ? 
            await campanaModel.getPersonajeById(id_personaje) : null;
        
        await campanaModel.desasociarPersonajeDeCampana(id_personaje);
        res.json({ mensaje: 'Personaje desasociado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtiene todos los NPCs de una campaña
const getNpcsDeCampana = async (req, res) => {
    const { id } = req.params;
    try {
        const npcs = await campanaModel.getNpcsByCampana(id);
        res.json(npcs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crea un NPC en una campaña
const crearNpc = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, imagen_url } = req.body;
    const id_usuario = req.usuario.id;

    try {
        const campana = await campanaModel.getCampanaById(id);
        if (!campana) return res.status(404).json({ error: 'Campaña no encontrada' });
        if (campana.id_master !== id_usuario) return res.status(403).json({ error: 'Solo el máster puede crear NPCs' });

        const result = await campanaModel.crearNpc(nombre, descripcion, id_usuario, id, imagen_url);
        res.status(201).json({ mensaje: 'NPC creado correctamente', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Cambia la visibilidad de un NPC
const toggleVisibilidadNpc = async (req, res) => {
    const { id, id_npc } = req.params;
    const { visible } = req.body;
    const id_usuario = req.usuario.id;

    try {
        const campana = await campanaModel.getCampanaById(id);
        if (!campana) return res.status(404).json({ error: 'Campaña no encontrada' });
        if (campana.id_master !== id_usuario) return res.status(403).json({ error: 'Solo el máster puede cambiar la visibilidad' });

        await campanaModel.toggleVisibilidadNpc(id_npc, visible);
        res.json({ mensaje: 'Visibilidad actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Cambia la visibilidad de la pestaña NPCs
const toggleNpcsVisibles = async (req, res) => {
    const { id } = req.params;
    const { npcs_visibles } = req.body;
    const id_usuario = req.usuario.id;

    try {
        const campana = await campanaModel.getCampanaById(id);
        if (!campana) return res.status(404).json({ error: 'Campaña no encontrada' });
        if (campana.id_master !== id_usuario) return res.status(403).json({ error: 'Solo el máster puede cambiar esto' });

        await campanaModel.toggleNpcsVisibles(id, npcs_visibles);
        res.json({ mensaje: 'Visibilidad de NPCs actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Elimina un NPC
const eliminarNpc = async (req, res) => {
    const { id, id_npc } = req.params;
    const id_usuario = req.usuario.id;

    try {
        const campana = await campanaModel.getCampanaById(id);
        if (!campana) return res.status(404).json({ error: 'Campaña no encontrada' });
        if (campana.id_master !== id_usuario) return res.status(403).json({ error: 'Solo el máster puede eliminar NPCs' });

        await campanaModel.eliminarNpc(id_npc);
        res.json({ mensaje: 'NPC eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Edita un NPC simple
const editarNpc = async (req, res) => {
    const { id, id_npc } = req.params;
    const { nombre, descripcion, imagen_url } = req.body;
    const id_usuario = req.usuario.id;

    try {
        const campana = await campanaModel.getCampanaById(id);
        if (!campana) return res.status(404).json({ error: 'Campaña no encontrada' });
        if (campana.id_master !== id_usuario) return res.status(403).json({ error: 'Solo el máster puede editar NPCs' });

        await campanaModel.editarNpc(id_npc, nombre, descripcion, imagen_url);
        res.json({ mensaje: 'NPC editado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { 
    crearCampana, getCampanas, getCampana, editarCampana, eliminarCampana, 
    unirseACampana, getPersonajesDeCampana, asociarPersonaje, desasociarPersonaje,
    getParticipantesDeCampana, getNpcsDeCampana, crearNpc, toggleVisibilidadNpc,
    toggleNpcsVisibles, eliminarNpc, editarNpc
};