const db = require('../config/db');

// Crea una nueva campaña en la base de datos
const crearCampana = async (titulo, descripcion, codigo_invitacion, id_master, mapa_url) => {
    const [result] = await db.query(
        'INSERT INTO campana (titulo, descripcion, codigo_invitacion, id_master, mapa_url) VALUES (?, ?, ?, ?, ?)',
        [titulo, descripcion, codigo_invitacion, id_master, mapa_url || null]
    );
    return result;
};

// Obtiene todas las campañas en las que participa un usuario
const getCampanasByUsuario = async (id_usuario) => {
    const [rows] = await db.query(
        `SELECT c.* FROM campana c
         INNER JOIN participa p ON c.id = p.id_campana
         WHERE p.id_usuario = ?`,
        [id_usuario]
    );
    return rows;
};

// Obtiene una campaña por su id
const getCampanaById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM campana WHERE id = ?',
        [id]
    );
    return rows[0];
};

// Edita el título, descripción y visibilidad de npcs de una campaña
const editarCampana = async (id, titulo, descripcion, npcs_visibles, mapa_url) => {
    const [result] = await db.query(
        'UPDATE campana SET titulo = ?, descripcion = ?, npcs_visibles = ?, mapa_url = ? WHERE id = ?',
        [titulo, descripcion, npcs_visibles, mapa_url, id]
    );
    return result;
};

// Elimina una campaña por su id
const eliminarCampana = async (id) => {
    const [result] = await db.query(
        'DELETE FROM campana WHERE id = ?',
        [id]
    );
    return result;
};


// Añade un usuario a una campaña con un rol determinado
const agregarParticipante = async (id_campana, id_usuario, rol) => {
    const [result] = await db.query(
        'INSERT INTO participa (id_campana, id_usuario, rol) VALUES (?, ?, ?)',
        [id_campana, id_usuario, rol]
    );
    return result;
};



// Busca una campaña por su código de invitación
const getCampanaByCodigoInvitacion = async (codigo) => {
    const [rows] = await db.query(
        'SELECT * FROM campana WHERE codigo_invitacion = ?',
        [codigo]
    );
    return rows[0];
};

// Comprueba si un usuario ya participa en una campaña
const isParticipante = async (id_campana, id_usuario) => {
    const [rows] = await db.query(
        'SELECT * FROM participa WHERE id_campana = ? AND id_usuario = ?',
        [id_campana, id_usuario]
    );
    return rows.length > 0;
};

// Obtiene todos los participantes de una campaña
const getParticipantesByCampana = async (id_campana) => {
    const [rows] = await db.query(
        `SELECT u.id, u.nombre_usuario, p.rol
         FROM participa p
         INNER JOIN usuario u ON p.id_usuario = u.id
         WHERE p.id_campana = ?`,
        [id_campana]
    );
    return rows;
};

// Obtiene todos los personajes asociados a una campaña
const getPersonajesByCampana = async (id_campana) => {
    const [rows] = await db.query(
        `SELECT p.*, f.sistema, f.datos, u.nombre_usuario
         FROM personaje p
         LEFT JOIN ficha f ON p.id = f.id_personaje
         INNER JOIN usuario u ON p.id_usuario = u.id
         WHERE p.id_campana = ? AND p.es_npc = FALSE`,
        [id_campana]
    );
    return rows;
};

// Asocia un personaje a una campaña
const asociarPersonajeACampana = async (id_personaje, id_campana) => {
    const [result] = await db.query(
        'UPDATE personaje SET id_campana = ? WHERE id = ?',
        [id_campana, id_personaje]
    );
    return result;
};

// Desasocia un personaje de una campaña
const desasociarPersonajeDeCampana = async (id_personaje) => {
    const [result] = await db.query(
        'UPDATE personaje SET id_campana = NULL WHERE id = ?',
        [id_personaje]
    );
    return result;
};


// Obtiene todos los NPCs de una campaña
const getNpcsByCampana = async (id_campana) => {
    const [rows] = await db.query(
        `SELECT p.*, f.sistema, f.datos
         FROM personaje p
         LEFT JOIN ficha f ON p.id = f.id_personaje
         WHERE p.id_campana = ? AND p.es_npc = TRUE`,
        [id_campana]
    );
    return rows;
};

// Crea un NPC simple sin ficha
const crearNpc = async (nombre, descripcion, id_usuario, id_campana) => {
    const [result] = await db.query(
        'INSERT INTO personaje (nombre, descripcion, id_usuario, id_campana, es_npc, visible) VALUES (?, ?, ?, ?, TRUE, TRUE)',
        [nombre, descripcion, id_usuario, id_campana]
    );
    return result;
};

// Cambia la visibilidad de un NPC
const toggleVisibilidadNpc = async (id_personaje, visible) => {
    const [result] = await db.query(
        'UPDATE personaje SET visible = ? WHERE id = ?',
        [visible, id_personaje]
    );
    return result;
};

// Cambia la visibilidad de la pestaña NPCs de una campaña
const toggleNpcsVisibles = async (id_campana, npcs_visibles) => {
    const [result] = await db.query(
        'UPDATE campana SET npcs_visibles = ? WHERE id = ?',
        [npcs_visibles, id_campana]
    );
    return result;
};

// Elimina un NPC
const eliminarNpc = async (id) => {
    const [result] = await db.query(
        'DELETE FROM personaje WHERE id = ? AND es_npc = TRUE',
        [id]
    );
    return result;
};

module.exports = { crearCampana, getCampanasByUsuario, getCampanaById, editarCampana, eliminarCampana, agregarParticipante, getCampanaByCodigoInvitacion, getParticipantesByCampana, isParticipante, getPersonajesByCampana, asociarPersonajeACampana, desasociarPersonajeDeCampana, getNpcsByCampana, eliminarNpc, toggleNpcsVisibles, toggleVisibilidadNpc, crearNpc };