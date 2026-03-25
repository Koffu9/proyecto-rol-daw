import api from './api';

// Obtiene todas las campañas del usuario
export const getCampanasRequest = () => api.get('/campanas');

// Obtiene el detalle de una campaña
export const getCampanaRequest = (id) => api.get(`/campanas/${id}`);

// Crea una nueva campaña
export const crearCampanaRequest = (datos) => api.post('/campanas', datos);

// Edita una campaña
export const editarCampanaRequest = (id, datos) => api.put(`/campanas/${id}`, datos);

// Elimina una campaña
export const eliminarCampanaRequest = (id) => api.delete(`/campanas/${id}`);