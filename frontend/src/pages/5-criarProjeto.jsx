import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CriarProjeto() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    status: 'Ativo',
    descricao: '',
    localizacao: '',
    dataInicio: '',
    dataFim: '',
    financiamento: '',
    orcamento: '',
    objetivos: '',
    metodologia: '',
    resultadosEsperados: '',
    palavrasChave: '',
    colaboradores: '',
    imagens: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, imagens: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'imagens') {
        value.forEach((file) => formData.append('imagens', file));
      } else {
        formData.append(key, value);
      }
    });

    try {
      await api.post('/projetos', formData);
      alert('Projeto criado com sucesso!');
      navigate('/projetos');
    } catch (error) {
      console.error('Erro ao criar projeto', error);
      alert('Erro ao criar projeto');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Criar Novo Projeto</h1>
      <p className="text-gray-600 mb-6">Preencha as informações detalhadas do seu projeto de pesquisa científica</p>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-semibold">Nome do Projeto *</label>
          <input
            type="text"
            name="nome"
            placeholder="Ex: Biodiversidade da Mata Atlântica"
            value={form.nome}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          >
            <option>Ativo</option>
            <option>Concluído</option>
            <option>Em Pausa</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Descrição *</label>
          <textarea
            name="descricao"
            placeholder="Descreva os objetivos e escopo do projeto..."
            value={form.descricao}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Localização</label>
          <input
            type="text"
            name="localizacao"
            value={form.localizacao}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Data de Início</label>
            <input
              type="date"
              name="dataInicio"
              value={form.dataInicio}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold">Data de Término</label>
            <input
              type="date"
              name="dataFim"
              value={form.dataFim}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/*<div>
            <label className="block font-semibold">Fonte de Financiamento</label>
            <input
              type="text"
              name="financiamento"
              placeholder="Ex: CNPq, FAPESP, CAPES"
              value={form.financiamento}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>*/}

          {/*<div>
            <label className="block font-semibold">Orçamento (R$)</label>
            <input
              type="number"
              name="orcamento"
              placeholder="Ex: 50000.00"
              value={form.orcamento}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>*/}
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

        {/*<div>
          <label className="block font-semibold">Palavras-chave</label>
          <input
            type="text"
            name="palavrasChave"
            value={form.palavrasChave}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>*/}

        {/*<div>
          <label className="block font-semibold">Colaboradores</label>
          <input
            type="text"
            name="colaboradores"
            value={form.colaboradores}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>*/}

        <div>
          <label className="block font-semibold">Imagens do Projeto (Máximo 10)</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full"
            accept="image/*"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Criar Projeto
          </button>
        </div>

      </form>
    </div>
  );
}

export default CriarProjeto;