const personajeModel = require('../models/personajeModel');

// Obtiene todos los personajes del usuario autenticado
const getPersonajes = async (req, res) => {
    const id_usuario = req.usuario.id;
    try {
        const personajes = await personajeModel.getPersonajesByUsuario(id_usuario);
        res.json(personajes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtiene el detalle de un personaje con su ficha
const getPersonaje = async (req, res) => {
    const { id } = req.params;
    try {
        const personaje = await personajeModel.getPersonajeById(id);
        if (!personaje) return res.status(404).json({ error: 'Personaje no encontrado' });

        const ficha = await personajeModel.getFichaByPersonaje(id);
        res.json({ ...personaje, ficha: ficha || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



// Crea un nuevo personaje y su ficha
const crearPersonaje = async (req, res) => {
    const { nombre, descripcion, id_campana, es_npc, imagen_url, sistema, datos } = req.body;
    const id_usuario = req.usuario.id;

    try {
        const result = await personajeModel.crearPersonaje(nombre, descripcion, id_usuario, id_campana || null, es_npc || false, imagen_url || null);
        const id_personaje = result.insertId;

        if (sistema && datos) {
            await personajeModel.guardarFicha(id_personaje, sistema, datos);
        }

        res.status(201).json({ mensaje: 'Personaje creado correctamente', id: id_personaje });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Edita los datos básicos de un personaje y su ficha
const editarPersonaje = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, imagen_url, sistema, datos } = req.body;
    const id_usuario = req.usuario.id;

    try {
        const personaje = await personajeModel.getPersonajeById(id);
        if (!personaje) return res.status(404).json({ error: 'Personaje no encontrado' });
        if (personaje.id_usuario !== id_usuario) return res.status(403).json({ error: 'No tienes permisos para editar este personaje' });

        await personajeModel.editarPersonaje(id, nombre, descripcion, imagen_url);

        if (sistema && datos) {
            await personajeModel.guardarFicha(id, sistema, datos);
        }

        res.json({ mensaje: 'Personaje editado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Elimina un personaje
const eliminarPersonaje = async (req, res) => {
    const { id } = req.params;
    const id_usuario = req.usuario.id;

    try {
        const personaje = await personajeModel.getPersonajeById(id);
        if (!personaje) return res.status(404).json({ error: 'Personaje no encontrado' });
        if (personaje.id_usuario !== id_usuario) return res.status(403).json({ error: 'No tienes permisos para eliminar este personaje' });

        await personajeModel.eliminarPersonaje(id);
        res.json({ mensaje: 'Personaje eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtiene todos los sistemas disponibles
const getSistemas = async (req, res) => {
    try {
        const sistemas = await personajeModel.getSistemas();
        res.json(sistemas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Sube el nivel del personaje y actualiza su ficha
const subirNivel = async (req, res) => {
    const { id } = req.params;
    const { datos } = req.body;
    const id_usuario = req.usuario.id;

    try {
        const personaje = await personajeModel.getPersonajeById(id);
        if (!personaje) return res.status(404).json({ error: 'Personaje no encontrado' });
        if (personaje.id_usuario !== id_usuario) return res.status(403).json({ error: 'No tienes permisos para editar este personaje' });

        await personajeModel.subirNivel(id, datos);
        res.json({ mensaje: 'Nivel subido correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


module.exports = { getPersonajes, getPersonaje, crearPersonaje, editarPersonaje, eliminarPersonaje, getSistemas, subirNivel };