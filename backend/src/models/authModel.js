const db = require('../config/db');

const findByEmailOrUsername = async (email, nombre_usuario) => {
    const [rows] = await db.query(
        'SELECT id FROM usuario WHERE email = ? OR nombre_usuario = ?',
        [email, nombre_usuario]
    );
    return rows;
};

const findByEmail = async (email) => {
    const [rows] = await db.query(
        'SELECT * FROM usuario WHERE email = ?',
        [email]
    );
    return rows;
};

const createUsuario = async (nombre_usuario, email, password_hash) => {
    const [result] = await db.query(
        'INSERT INTO usuario (nombre_usuario, email, password_hash) VALUES (?, ?, ?)',
        [nombre_usuario, email, password_hash]
    );
    return result;
};

module.exports = { findByEmailOrUsername, findByEmail, createUsuario };