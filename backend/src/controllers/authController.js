const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

//Lógica del registro
const register = async (req, res) => {
    const { nombre_usuario, email, password } = req.body;

    try {
        const existing = await authModel.findByEmailOrUsername(email, nombre_usuario);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'El email o nombre de usuario ya está en uso' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const result = await authModel.createUsuario(nombre_usuario, email, password_hash);

        res.status(201).json({ mensaje: 'Usuario registrado correctamente', id: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Lógica del login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = await authModel.findByEmail(email);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const usuario = users[0];
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: usuario.id, nombre_usuario: usuario.nombre_usuario },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre_usuario: usuario.nombre_usuario,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { register, login };