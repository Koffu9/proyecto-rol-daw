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


// Obtiene un usuario por su id
const findById = async (id) => {
    const [rows] = await db.query(
        'SELECT id, nombre_usuario, email, imagen_url, created_at FROM usuario WHERE id = ?',
        [id]
    );
    return rows[0];
};

// Actualiza la foto de perfil de un usuario
const updateImagenPerfil = async (id, imagen_url) => {
    const [result] = await db.query(
        'UPDATE usuario SET imagen_url = ? WHERE id = ?',
        [imagen_url, id]
    );
    return result;
};

// Actualiza la contraseña de un usuario
const updatePassword = async (id, password_hash) => {
    const [result] = await db.query(
        'UPDATE usuario SET password_hash = ? WHERE id = ?',
        [password_hash, id]
    );
    return result;
};

// Guarda la hora de inicio de sesión
const updateUltimaConexion = async (id) => {
    const [result] = await db.query(
        'UPDATE usuario SET ultima_conexion = NOW() WHERE id = ?',
        [id]
    );
    return result;
};

// Suma las horas de la sesión actual a las horas totales
const updateHorasConexion = async (id) => {
    const [result] = await db.query(
        `UPDATE usuario 
         SET horas_conexion = horas_conexion + TIMESTAMPDIFF(SECOND, ultima_conexion, NOW()) / 3600,
             ultima_conexion = NULL
         WHERE id = ? AND ultima_conexion IS NOT NULL`,
        [id]
    );
    return result;
};

module.exports = { findByEmailOrUsername, findByEmail, createUsuario, findById, updateImagenPerfil, updatePassword, updateUltimaConexion, updateHorasConexion };