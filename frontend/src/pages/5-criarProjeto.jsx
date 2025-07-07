import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterUsuarioLogado } from '../services/usuarioService';
import { criarProjeto } from '../services/projetoService';

function CriarProjeto() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    objetivos: '',
    metodologia: '',
    resultadosEsperados: '',
    palavrasChave: '',
    colaboradores: '',
    financiamento: '',
    orcamento: '',
    data_inicio: '',
    data_fim: '',
    imageLink: ''
  });

  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        const resp = await obterUsuarioLogado();
        setUsuario(resp.data);
      } catch (err) {
        console.error("Erro ao buscar usuário logado", err);
        alert("Erro ao obter usuário logado.");
        navigate('/login');
      }
    };

    buscarUsuario();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario?.idUsuarios) {
      alert("Usuário não autenticado!");
      return;
    }

    setLoading(true);

    try {
      const projetoData = {
        ...Object.fromEntries(
          Object.entries(form).map(([key, value]) =>
            value === '' ? [key, null] : [key, value]
          )
        ),
        criado_por: usuario.idUsuarios,
      };

      await criarProjeto(projetoData);

      alert('Projeto criado com sucesso!');
      navigate('/projetos');
    } catch (error) {
      console.error('Erro ao criar projeto', error);
      alert(error.response?.data?.error || 'Erro ao criar projeto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Criar Novo Projeto</h1>
      <p className="text-gray-600 mb-6">
        Preencha as informações detalhadas do seu projeto de pesquisa científica.
      </p>

      {loading && (
        <div className="flex justify-center items-center mb-4">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-blue-600"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <span className="text-blue-600 font-semibold">Salvando projeto...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Nome do Projeto *</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Objetivos</label>
          <textarea
            name="objetivos"
            value={form.objetivos}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Metodologia</label>
          <textarea
            name="metodologia"
            value={form.metodologia}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Resultados Esperados</label>
          <textarea
            name="resultadosEsperados"
            value={form.resultadosEsperados}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Palavras-chave</label>
          <input
            type="text"
            name="palavrasChave"
            value={form.palavrasChave}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Colaboradores *</label>
          <input
            type="text"
            name="colaboradores"
            value={form.colaboradores}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Financiamento</label>
          <input
            type="text"
            name="financiamento"
            value={form.financiamento}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Orçamento (R$)</label>
          <input
            type="number"
            name="orcamento"
            value={form.orcamento}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Data de Início *</label>
            <input
              type="date"
              name="data_inicio"
              value={form.data_inicio}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Data de Término</label>
            <input
              type="date"
              name="data_fim"
              value={form.data_fim}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold">Link da Imagem</label>
          <input
            type="text"
            name="imageLink"
            value={form.imageLink}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Criar Projeto"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CriarProjeto;
