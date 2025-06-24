import api from './api';

// Registrar uma nova credencial (criar login)
export const criarCredencial = (data) => api.post('/credenciais/registrar', data);

// Fazer login
export const login = (data) => api.post('/credenciais/login', data);

// Listar todas as credenciais (geralmente uso admin)
export const getCredenciais = () => api.get('/credenciais');

// Buscar uma credencial por ID
export const getCredencialById = (id) => api.get(`/credenciais/${id}`);

// Atualizar uma credencial (email ou senha)
export const atualizarCredencial = (id, data) => api.put(`/credenciais/${id}`, data);

// Deletar uma credencial
export const deletarCredencial = (id) => api.delete(`/credenciais/${id}`);
