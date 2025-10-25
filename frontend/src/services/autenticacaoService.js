import api from './api';

export const cadastrarUsuarioCompleto = (dados) => {
  return api.post('/cadastro/cadastro-completo', dados);
};
