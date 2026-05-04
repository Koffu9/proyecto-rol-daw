import api from './api';

// Obtiene el perfil del usuario con estadísticas
export const getPerfilRequest = () => api.get('/perfil');

// Actualiza la foto de perfil
export const updateImagenPerfilRequest = (imagen_url) => api.put('/perfil/imagen', { imagen_url });

// Cambia la contraseña
export const updatePasswordRequest = (datos) => api.put('/perfil/password', datos);