import api from './api';

export const getColetas = () => api.get('/coletas');
export const getColetaById = (id) => api.get(`/coletas/${id}`);
export const criarColeta = (data) => api.post('/coletas', data);
export const atualizarColeta = (id, data) => api.put(`/coletas/${id}`, data);
export const deletarColeta = (id) => api.delete(`/coletas/${id}`);
