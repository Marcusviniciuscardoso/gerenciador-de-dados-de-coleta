import api from './api';

export const getAmostras = () => api.get('/amostras');
export const getAmostraById = (id) => api.get(`/amostras/${id}`);
export const criarAmostra = (data) => api.post('/amostras', data);
export const atualizarAmostra = (id, data) => api.put(`/amostras/${id}`, data);
export const deletarAmostra = (id) => api.delete(`/amostras/${id}`);
