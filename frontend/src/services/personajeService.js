import api from './api';

// Obtiene todos los personajes del usuario
export const getPersonajesRequest = () => api.get('/personajes');

// Obtiene el detalle de un personaje con su ficha
export const getPersonajeRequest = (id) => api.get(`/personajes/${id}`);

// Crea un nuevo personaje
export const crearPersonajeRequest = (datos) => api.post('/personajes', datos);

// Edita un personaje
export const editarPersonajeRequest = (id, datos) => api.put(`/personajes/${id}`, datos);

// Elimina un personaje
export const eliminarPersonajeRequest = (id) => api.delete(`/personajes/${id}`);

// Obtiene los sistemas disponibles
export const getSistemasRequest = () => api.get('/personajes/sistemas');