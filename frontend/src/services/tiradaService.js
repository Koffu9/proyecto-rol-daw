import api from './api';

// Realiza una tirada de dados
export const realizarTiradaRequest = (formula, id_personaje, id_campana) => 
    api.post('/tiradas', { formula, id_personaje, id_campana });

// Obtiene el historial de tiradas del usuario
export const getTiradasUsuarioRequest = () => api.get('/tiradas/usuario');

// Obtiene el historial de tiradas de una campaña
export const getTiradasCampanaRequest = (id) => api.get(`/tiradas/campana/${id}`);