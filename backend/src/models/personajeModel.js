const db = require('../config/db');

// Crea un nuevo personaje
const crearPersonaje = async (nombre, descripcion, id_usuario, id_campana, es_npc = false) => {
    const [result] = await db.query(
        'INSERT INTO personaje (nombre, descripcion, id_usuario, id_campana, es_npc) VALUES (?, ?, ?, ?, ?)',
        [nombre, descripcion, id_usuario, id_campana, es_npc]
    );
    return result;
};

// Obtiene todos los personajes de un usuario
const getPersonajesByUsuario = async (id_usuario) => {
    const [rows] = await db.query(
        `SELECT p.*, 
                f.sistema, 
                f.datos,
                c.titulo AS campana_titulo
         FROM personaje p
         LEFT JOIN ficha f ON p.id = f.id_personaje
         LEFT JOIN campana c ON p.id_campana = c.id
         WHERE p.id_usuario = ? AND p.es_npc = FALSE`,
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

// Sube el nivel del personaje y actualiza su ficha
const subirNivel = async (id_personaje, datos) => {
    const [result] = await db.query(
        'UPDATE ficha SET datos = ? WHERE id_personaje = ?',
        [JSON.stringify(datos), id_personaje]
    );
    return result;
};

module.exports = {
    crearPersonaje,
    getPersonajesByUsuario,
    getPersonajeById,
    getFichaByPersonaje,
    guardarFicha,
    editarPersonaje,
    eliminarPersonaje,
    getSistemas,
    subirNivel
};