import api from './api';

export const getUsuarios = () => api.get('/usuarios');
export const getUsuarioById = (id) => api.get(`/usuarios/${id}`);
export const criarUsuario = (data) => api.post('/usuarios', data);
export const atualizarUsuario = (id, data) => api.put(`/usuarios/${id}`, data);
export const deletarUsuario = (id) => api.delete(`/usuarios/${id}`);
