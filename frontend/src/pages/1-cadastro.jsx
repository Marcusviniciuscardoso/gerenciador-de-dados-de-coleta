import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cadastrarUsuarioCompleto } from '../services/autenticacaoService'; // novo import
import { criarUsuario } from '../services/usuarioService';
import { criarCredencial } from '../services/credencialService';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  telefone: Yup.string()
    .matches(/^\d{8,15}$/, 'Telefone inválido')
    .nullable(),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  instituicao: Yup.string()
    .required('Instituição é obrigatória'),
  biografia: Yup.string()
    .max(255, 'Biografia muito longa')
    .nullable(),
  senha: Yup.string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmarSenha: Yup.string()
    .oneOf([Yup.ref('senha')], 'As senhas não coincidem')
    .required('Confirmação da senha é obrigatória'),
  termos: Yup.boolean()
    .oneOf([true], 'Você deve aceitar os termos de uso.')
});


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

  try {
    console.log("➡️ Validando formulário...");
    await schema.validate(form, { abortEarly: false });

    console.log("✅ Validação OK, enviando dados...");
    const response = await cadastrarUsuarioCompleto({
      nome: form.nome,
      telefone: form.telefone,
      instituicao: form.instituicao,
      biografia: form.biografia,
      email: form.email,
      senha: form.senha
    });

    console.log("✅ Cadastro completo:", response.data);
    alert('Usuário criado com sucesso!');
    navigate('/login');

  } catch (err) {
    console.error("❌ Erro ao cadastrar:", err);

    if (err.name === 'ValidationError') {
      const mensagem = err.errors.join('\n');
      alert(mensagem);
    } else {
      const msg = err.response?.data?.error || err.message;
      alert(`Erro ao criar usuário: ${msg}`);
    }
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
