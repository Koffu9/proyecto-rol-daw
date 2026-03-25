const db = require('../config/db');

// Crea una nueva campaña en la base de datos
const crearCampana = async (titulo, descripcion, codigo_invitacion, id_master) => {
    const [result] = await db.query(
        'INSERT INTO campana (titulo, descripcion, codigo_invitacion, id_master) VALUES (?, ?, ?, ?)',
        [titulo, descripcion, codigo_invitacion, id_master]
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
const editarCampana = async (id, titulo, descripcion, npcs_visibles) => {
    const [result] = await db.query(
        'UPDATE campana SET titulo = ?, descripcion = ?, npcs_visibles = ? WHERE id = ?',
        [titulo, descripcion, npcs_visibles, id]
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


module.exports = { crearCampana, getCampanasByUsuario, getCampanaById, editarCampana, eliminarCampana, agregarParticipante };