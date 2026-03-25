const campanaModel = require('../models/campanaModel');
const { v4: uuidv4 } = require('uuid');

// Crea una nueva campaña y añade al creador como máster en la tabla participa
const crearCampana = async (req, res) => {
    const { titulo, descripcion } = req.body;
    const id_master = req.usuario.id;

    try {
        // Generamos un código de invitación único
        const codigo_invitacion = uuidv4().slice(0, 8).toUpperCase();

        const result = await campanaModel.crearCampana(titulo, descripcion, codigo_invitacion, id_master);
        const id_campana = result.insertId;

        // Añadimos al creador como máster en la tabla participa
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

    try {
        const campana = await campanaModel.getCampanaById(id);
        if (!campana) return res.status(404).json({ error: 'Campaña no encontrada' });

        res.json(campana);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Edita una campaña, solo si el usuario es el máster
const editarCampana = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, npcs_visibles } = req.body;
    const id_usuario = req.usuario.id;

    try {
        const campana = await campanaModel.getCampanaById(id);
        if (!campana) return res.status(404).json({ error: 'Campaña no encontrada' });
        if (campana.id_master !== id_usuario) return res.status(403).json({ error: 'No tienes permisos para editar esta campaña' });

        await campanaModel.editarCampana(id, titulo, descripcion, npcs_visibles);
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

module.exports = { crearCampana, getCampanas, getCampana, editarCampana, eliminarCampana };