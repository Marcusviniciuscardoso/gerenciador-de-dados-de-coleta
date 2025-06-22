import api from './api';

export const getImagens = () => api.get('/imagens');
export const getImagemById = (id) => api.get(`/imagens/${id}`);
export const criarImagem = (data) => api.post('/imagens', data);
export const atualizarImagem = (id, data) => api.put(`/imagens/${id}`, data);
export const deletarImagem = (id) => api.delete(`/imagens/${id}`);
