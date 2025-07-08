import api from './api';

export const getProjetos = () => api.get('/projetos');
export const getProjetosByUsuarioId = (usuarioId) => api.get(`/projetos/usuario/${usuarioId}`);
export const getProjetoById = (id) => api.get(`/projetos/${id}`);
export const criarProjeto = (data) => api.post('/projetos', data);
export const atualizarProjeto = (id, data) => api.put(`/projetos/${id}`, data);
export const deletarProjeto = (id) => api.delete(`/projetos/${id}`);
