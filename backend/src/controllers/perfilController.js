const bcrypt = require('bcryptjs');
const authModel = require('../models/authModel');
const tiradaModel = require('../models/tiradaModel');
const campanaModel = require('../models/campanaModel');
const personajeModel = require('../models/personajeModel');

// Obtiene el perfil del usuario con estadísticas
const getPerfil = async (req, res) => {
    const id_usuario = req.usuario.id;
    try {
        const usuario = await authModel.findById(id_usuario);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Estadísticas
        const campanas = await campanaModel.getCampanasByUsuario(id_usuario);
        const personajes = await personajeModel.getPersonajesByUsuario(id_usuario);
        const tiradas = await tiradaModel.getTiradasByUsuario(id_usuario);

        res.json({
            ...usuario,
            stats: {
                campanas: campanas.length,
                personajes: personajes.length,
                tiradas: tiradas.length
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualiza la foto de perfil
const updateImagenPerfil = async (req, res) => {
    const id_usuario = req.usuario.id;
    const { imagen_url } = req.body;
    try {
        await authModel.updateImagenPerfil(id_usuario, imagen_url);
        res.json({ mensaje: 'Foto de perfil actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Cambia la contraseña del usuario
const updatePassword = async (req, res) => {
    const id_usuario = req.usuario.id;
    const { password_actual, password_nueva, confirmar_password } = req.body;

    try {
        if (password_nueva !== confirmar_password) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
        }

        const usuario = await authModel.findById(id_usuario);
        const usuarioCompleto = await authModel.findByEmail(usuario.email);
        const passwordValida = await bcrypt.compare(password_actual, usuarioCompleto[0].password_hash);

        if (!passwordValida) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }

        const password_hash = await bcrypt.hash(password_nueva, 10);
        await authModel.updatePassword(id_usuario, password_hash);

        res.json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getPerfil, updateImagenPerfil, updatePassword };