import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import api from '../services/api';

function NovaAmostra() {
  const { projetoId, coletaId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    descricao: '',
    codigo: '',
    tipoAmostra: '',
    recipiente: '',
    idRecipiente: '',
    metodoPreservacao: '',
    localArmazenamento: '',
    temperatura: '',
    quantidade: '',
    unidade: '',
    validade: '',
    coletadoPor: '',
    processadoPor: '',
    avaliacaoQualidade: '',
    notasProcessamento: '',
    tags: '',
    observacoes: '',
    imagens: [],
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
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'imagens') {
          value.forEach((img) => formData.append('imagens', img));
        } else {
          formData.append(key, value);
        }
      });
      formData.append('coletaId', coletaId);

      await api.post(`/amostras`, formData);
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
            <input name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descrição da Amostra *" className="border rounded px-3 py-2" />
            <input name="codigo" value={form.codigo} onChange={handleChange} placeholder="Código de Identificação *" className="border rounded px-3 py-2" />
            <input name="tipoAmostra" value={form.tipoAmostra} onChange={handleChange} placeholder="Tipo de Amostra (Ex: Tecido)" className="border rounded px-3 py-2" />
          </div>
        </div>

        {/* Armazenamento */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Armazenamento</h2>
          <div className="flex flex-col gap-3">
            <input name="recipiente" value={form.recipiente} onChange={handleChange} placeholder="Tipo de Recipiente *" className="border rounded px-3 py-2" />
            <input name="idRecipiente" value={form.idRecipiente} onChange={handleChange} placeholder="ID do Recipiente" className="border rounded px-3 py-2" />
            <input name="metodoPreservacao" value={form.metodoPreservacao} onChange={handleChange} placeholder="Método de Preservação *" className="border rounded px-3 py-2" />
            <input name="localArmazenamento" value={form.localArmazenamento} onChange={handleChange} placeholder="Local de Armazenamento" className="border rounded px-3 py-2" />
            <input name="temperatura" value={form.temperatura} onChange={handleChange} placeholder="Temperatura (°C)" className="border rounded px-3 py-2" />
          </div>
        </div>

        {/* Quantificação */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quantificação</h2>
          <div className="flex flex-col gap-3">
            <input name="quantidade" value={form.quantidade} onChange={handleChange} placeholder="Quantidade" className="border rounded px-3 py-2" />
            <input name="unidade" value={form.unidade} onChange={handleChange} placeholder="Unidade (Ex: gramas)" className="border rounded px-3 py-2" />
            <input name="validade" type="date" value={form.validade} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
        </div>

        {/* Responsáveis */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Responsáveis</h2>
          <div className="flex flex-col gap-3">
            <input name="coletadoPor" value={form.coletadoPor} onChange={handleChange} placeholder="Coletado por" className="border rounded px-3 py-2" />
            <input name="processadoPor" value={form.processadoPor} onChange={handleChange} placeholder="Processado por" className="border rounded px-3 py-2" />
          </div>
        </div>

        {/* Avaliação */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Avaliação de Qualidade</h2>
          <div className="flex flex-col gap-3">
            <textarea name="avaliacaoQualidade" value={form.avaliacaoQualidade} onChange={handleChange} placeholder="Descreva a qualidade da amostra" className="border rounded px-3 py-2" />
            <textarea name="notasProcessamento" value={form.notasProcessamento} onChange={handleChange} placeholder="Notas de Processamento" className="border rounded px-3 py-2" />
          </div>
        </div>

        {/* Tags e Observações */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Tags e Observações</h2>
          <div className="flex flex-col gap-3">
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags" className="border rounded px-3 py-2" />
            <textarea name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Observações Gerais" className="border rounded px-3 py-2" />
          </div>
        </div>

        {/* Imagens */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-3">Documentação Fotográfica</h2>
          <input type="file" multiple accept="image/*" onChange={handleImagem} className="border rounded px-3 py-2" />
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
