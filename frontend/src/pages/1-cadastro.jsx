import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { criarUsuario } from '../services/usuarioService';
import { criarCredencial } from '../services/credencialService';

const CadastroUsuario = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    instituicao: '',
    biografia: '',
    senha: '',
    confirmarSenha: '',
    termos: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.termos) {
      alert('Você deve aceitar os termos de uso.');
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      // 1. Criar credencial
      const credencialResponse = await criarCredencial({
        email: form.email,
        senha: form.senha
      });

      const credencialId = credencialResponse.data.idCredenciais;

      // 2. Criar usuário
      await criarUsuario({
        nome: form.nome,
        telefone: form.telefone,
        instituicao: form.instituicao,
        biografia: form.biografia,
        credencial_id: credencialId
      });

      alert('Usuário criado com sucesso!');
      navigate('/login');

    } catch (error) {
      console.error(error);
      alert('Erro ao criar usuário');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-green-600 rounded-full p-3 mb-2">
          <span className="text-white text-2xl">🧪</span>
        </div>
        <h1 className="text-2xl font-bold">Sistema de Coleta Científica</h1>
        <p className="text-sm text-gray-500">Crie sua conta para começar</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2 text-center">Cadastrar</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Preencha os dados para criar sua conta
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            name="nome"
            type="text"
            placeholder="Nome Completo"
            value={form.nome}
            onChange={handleChange}
            className="input p-2 border"
            required
          />
          <input
            name="telefone"
            type="text"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            className="input p-2 border"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="input p-2 border"
            required
          />
          <input
            name="instituicao"
            type="text"
            placeholder="Instituição"
            value={form.instituicao}
            onChange={handleChange}
            className="input p-2 border"
            required
          />
          <input
            name="biografia"
            type="text"
            placeholder="Biografia ou Função"
            value={form.biografia}
            onChange={handleChange}
            className="input p-2 border"
          />

          <input
            name="senha"
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            value={form.senha}
            onChange={handleChange}
            className="input p-2 border"
            required
          />
          <input
            name="confirmarSenha"
            type="password"
            placeholder="Confirmar Senha"
            value={form.confirmarSenha}
            onChange={handleChange}
            className="input p-2 border"
            required
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="termos"
              checked={form.termos}
              onChange={handleChange}
              className="accent-green-600"
            />
            <span className="text-sm">
              Aceito os <a href="#" className="text-green-600 underline">termos de uso</a> e{' '}
              <a href="#" className="text-green-600 underline">política de privacidade</a>.
            </span>
          </label>

          <button
            type="submit"
            className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
          >
            Criar Conta
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-green-600 font-semibold">
            Faça login
          </Link>
        </p>
      </div>

      <footer className="mt-6 text-xs text-gray-500">
        © 2024 Sistema de Coleta Científica. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default CadastroUsuario;
