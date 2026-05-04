import api from './api';

// Sube una imagen y devuelve la URL
export const subirImagenRequest = async (file) => {
    const formData = new FormData();
    formData.append('imagen', file);
    const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.url;
};