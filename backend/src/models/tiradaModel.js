const db = require('../config/db');

// Guarda una tirada en la base de datos
const crearTirada = async (formula, resultado_total, detalle_dados, id_usuario, id_personaje, id_campana) => {
    const [result] = await db.query(
        'INSERT INTO tirada (formula, resultado_total, detalle_dados, id_usuario, id_personaje, id_campana) VALUES (?, ?, ?, ?, ?, ?)',
        [formula, resultado_total, JSON.stringify(detalle_dados), id_usuario, id_personaje || null, id_campana || null]
    );
    return result;
};

// Obtiene el historial de tiradas de un usuario
const getTiradasByUsuario = async (id_usuario) => {
    const [rows] = await db.query(
        `SELECT t.*, p.nombre AS personaje_nombre, c.titulo AS campana_titulo
         FROM tirada t
         LEFT JOIN personaje p ON t.id_personaje = p.id
         LEFT JOIN campana c ON t.id_campana = c.id
         WHERE t.id_usuario = ?
         ORDER BY t.timestamp DESC
         LIMIT 50`,
        [id_usuario]
    );
    return rows;
};

// Obtiene el historial de tiradas de una campaña
const getTiradasByCampana = async (id_campana) => {
    const [rows] = await db.query(
        `SELECT t.*, u.nombre_usuario, p.nombre AS personaje_nombre
         FROM tirada t
         INNER JOIN usuario u ON t.id_usuario = u.id
         LEFT JOIN personaje p ON t.id_personaje = p.id
         WHERE t.id_campana = ?
         ORDER BY t.timestamp DESC
         LIMIT 50`,
        [id_campana]
    );
    return rows;
};

module.exports = { crearTirada, getTiradasByUsuario, getTiradasByCampana };