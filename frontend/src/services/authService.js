import api from './api';

export const loginRequest = (datos) => api.post('/auth/login', datos);
export const registerRequest = (datos) => api.post('/auth/register', datos);