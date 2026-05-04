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

// Unirse a una campaña mediante código de invitación
export const unirseACampanaRequest = (codigo) => api.post('/campanas/unirse', { codigo });

// Obtiene los personajes de una campaña
export const getPersonajesDeCampanaRequest = (id) => api.get(`/campanas/${id}/personajes`);

// Asocia un personaje a una campaña
export const asociarPersonajeRequest = (id_campana, id_personaje) => api.post(`/campanas/${id_campana}/personajes`, { id_personaje });

// Desasocia un personaje de una campaña
export const desasociarPersonajeRequest = (id_campana, id_personaje) => api.delete(`/campanas/${id_campana}/personajes/${id_personaje}`);

// Obtiene los participantes de una campaña
export const getParticipantesRequest = (id) => api.get(`/campanas/${id}/participantes`);

// NPCs de una campaña
export const getNpcsDeCampanaRequest = (id) => api.get(`/campanas/${id}/npcs`);
export const crearNpcRequest = (id, datos) => api.post(`/campanas/${id}/npcs`, datos);
export const toggleVisibilidadNpcRequest = (id_campana, id_npc, visible) => api.put(`/campanas/${id_campana}/npcs/${id_npc}/visibilidad`, { visible });
export const toggleNpcsVisiblesRequest = (id_campana, npcs_visibles) => api.put(`/campanas/${id_campana}/npcs-visibles`, { npcs_visibles });
export const eliminarNpcRequest = (id_campana, id_npc) => api.delete(`/campanas/${id_campana}/npcs/${id_npc}`);
export const editarNpcRequest = (id_campana, id_npc, datos) => api.put(`/campanas/${id_campana}/npcs/${id_npc}`, datos);