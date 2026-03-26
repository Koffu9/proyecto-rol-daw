const db = require('../config/db');

// Crea un nuevo personaje
const crearPersonaje = async (nombre, descripcion, id_usuario, id_campana) => {
    const [result] = await db.query(
        'INSERT INTO personaje (nombre, descripcion, id_usuario, id_campana) VALUES (?, ?, ?, ?)',
        [nombre, descripcion, id_usuario, id_campana]
    );
    return result;
};

// Obtiene todos los personajes de un usuario
const getPersonajesByUsuario = async (id_usuario) => {
    const [rows] = await db.query(
        'SELECT p.*, s.nombre AS sistema_nombre FROM personaje p LEFT JOIN ficha f ON p.id = f.id_personaje LEFT JOIN sistema s ON f.sistema = s.slug WHERE p.id_usuario = ? AND p.es_npc = FALSE',
        [id_usuario]
    );
    return rows;
};

// Obtiene un personaje por su id
const getPersonajeById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM personaje WHERE id = ?',
        [id]
    );
    return rows[0];
};

// Obtiene la ficha de un personaje
const getFichaByPersonaje = async (id_personaje) => {
    const [rows] = await db.query(
        'SELECT * FROM ficha WHERE id_personaje = ?',
        [id_personaje]
    );
    return rows[0];
};

// Crea o actualiza la ficha de un personaje
const guardarFicha = async (id_personaje, sistema, datos) => {
    await db.query(
        'INSERT INTO ficha (id_personaje, sistema, datos) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE sistema = ?, datos = ?',
        [id_personaje, sistema, JSON.stringify(datos), sistema, JSON.stringify(datos)]
    );
};

// Edita los datos básicos de un personaje
const editarPersonaje = async (id, nombre, descripcion) => {
    const [result] = await db.query(
        'UPDATE personaje SET nombre = ?, descripcion = ? WHERE id = ?',
        [nombre, descripcion, id]
    );
    return result;
};

// Elimina un personaje por su id
const eliminarPersonaje = async (id) => {
    const [result] = await db.query(
        'DELETE FROM personaje WHERE id = ?',
        [id]
    );
    return result;
};

// Obtiene todos los sistemas disponibles
const getSistemas = async () => {
    const [rows] = await db.query('SELECT * FROM sistema');
    return rows;
};

module.exports = {
    crearPersonaje,
    getPersonajesByUsuario,
    getPersonajeById,
    getFichaByPersonaje,
    guardarFicha,
    editarPersonaje,
    eliminarPersonaje,
    getSistemas
};