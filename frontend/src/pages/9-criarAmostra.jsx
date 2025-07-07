import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { criarAmostra } from '../services/amostraService';

function NovaAmostra() {
  const { projetoId, coletaId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    descricao: '',
    codigo: '',
    tipoAmostra: '',
    recipiente: '',
    metodoPreservacao: '',
    quantidade: '',
    validade: '',
    identificacao_final: '',
    observacoes: '',
    imagens: [], // vai ficar vazio se não estiver enviando arquivos
  });

  const handleImagem = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, imagens: files });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const salvarAmostra = async () => {
    try {
      const payload = {
        ...form,
        coletaId,
      };

      await criarAmostra(payload);
      alert('Amostra registrada com sucesso!');
      navigate(`/projetos/${projetoId}/coletas/${coletaId}`);
    } catch (error) {
      console.error('Erro ao salvar amostra:', error);
      alert('Erro ao salvar amostra');
    }
  };

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Registrar Nova Amostra</h1>
          <p className="text-gray-600">Coleta: {coletaId}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 rounded border hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>
      </div>

      {/* Formulário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Identificação */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Identificação da Amostra</h2>
          <div className="flex flex-col gap-3">
            <input
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descrição da Amostra *"
              className="border rounded px-3 py-2"
            />
            <input
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              placeholder="Código de Identificação *"
              className="border rounded px-3 py-2"
            />
            <input
              name="tipoAmostra"
              value={form.tipoAmostra}
              onChange={handleChange}
              placeholder="Tipo de Amostra (Ex: Folha, Solo)"
              className="border rounded px-3 py-2"
            />
            <input
              name="identificacao_final"
              value={form.identificacao_final}
              onChange={handleChange}
              placeholder="Identificação Final"
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Armazenamento */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Armazenamento</h2>
          <div className="flex flex-col gap-3">
            <input
              name="recipiente"
              value={form.recipiente}
              onChange={handleChange}
              placeholder="Tipo de Recipiente *"
              className="border rounded px-3 py-2"
            />
            <input
              name="metodoPreservacao"
              value={form.metodoPreservacao}
              onChange={handleChange}
              placeholder="Método de Preservação *"
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Quantificação */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quantificação</h2>
          <div className="flex flex-col gap-3">
            <input
              name="quantidade"
              value={form.quantidade}
              onChange={handleChange}
              placeholder="Quantidade *"
              className="border rounded px-3 py-2"
            />
            <input
              name="validade"
              type="date"
              value={form.validade}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Observações */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Observações</h2>
          <textarea
            name="observacoes"
            value={form.observacoes}
            onChange={handleChange}
            placeholder="Observações gerais"
            className="border rounded px-3 py-2"
          />
        </div>

        {/* Imagens */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-3">Documentação Fotográfica</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagem}
            className="border rounded px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">Máximo 10 imagens</p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          onClick={salvarAmostra}
          className="flex items-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Amostra
        </button>
      </div>
    </div>
  );
}

export default NovaAmostra;
