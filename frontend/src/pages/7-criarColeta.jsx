import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import axios from '../services/api';

function NovaColeta() {
  const { projetoId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomeCientifico: '',
    nomePopular: '',
    reino: '',
    filo: '',
    classe: '',
    ordem: '',
    familia: '',
    genero: '',
    local: '',
    latitude: '',
    longitude: '',
    altitude: '',
    habitat: '',
    data: '',
    hora: '',
    condicoesClimaticas: '',
    temperatura: '',
    umidade: '',
    responsavel: '',
    metodo: '',
    equipamentos: '',
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

  const salvarColeta = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'imagens') {
          value.forEach((img) => formData.append('imagens', img));
        } else {
          formData.append(key, value);
        }
      });
      formData.append('projetoId', projetoId);

      await axios.post(`/coletas`, formData);
      alert('Coleta registrada com sucesso!');
      navigate(`/projetos/${projetoId}`);
    } catch (error) {
      console.error('Erro ao salvar coleta:', error);
      alert('Erro ao salvar coleta');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Registrar Nova Coleta</h1>
          <p className="text-gray-600">
            Projeto: Biodiversidade da Mata Atlântica
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 rounded border hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Identificação da Espécie */}
        <div className="col-span-1">
          <h2 className="font-semibold mb-3">Identificação da Espécie</h2>
          {['nomeCientifico', 'nomePopular', 'reino', 'filo', 'classe', 'ordem', 'familia', 'genero'].map((field) => (
            <div key={field} className="mb-3">
              <label className="block text-sm mb-1 capitalize">{field}</label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field === 'nomeCientifico' ? 'Nome Científico *' : ''}
                className="w-full border rounded px-3 py-2 focus:outline focus:ring focus:ring-blue-300"
              />
            </div>
          ))}
        </div>

        {/* Localização */}
        <div className="col-span-1">
          <h2 className="font-semibold mb-3">Localização</h2>
          {['local', 'latitude', 'longitude', 'altitude'].map((field) => (
            <div key={field} className="mb-3">
              <label className="block text-sm mb-1 capitalize">{field}</label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field === 'local' ? 'Descrição do Local *' : ''}
                className="w-full border rounded px-3 py-2 focus:outline focus:ring focus:ring-blue-300"
              />
            </div>
          ))}
          <div className="mb-3">
            <label className="block text-sm mb-1">Descrição do Habitat</label>
            <textarea
              name="habitat"
              value={form.habitat}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Data, Hora e Condições */}
        <div className="col-span-1">
          <h2 className="font-semibold mb-3">Data, Hora e Condições</h2>
          <div className="mb-3">
            <label className="block text-sm mb-1">Data</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm mb-1">Hora</label>
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          {['condicoesClimaticas', 'temperatura', 'umidade'].map((field) => (
            <div key={field} className="mb-3">
              <label className="block text-sm mb-1 capitalize">{field}</label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}
        </div>

        {/* Metodologia */}
        <div className="col-span-1">
          <h2 className="font-semibold mb-3">Metodologia</h2>
          {['responsavel', 'metodo', 'equipamentos'].map((field) => (
            <div key={field} className="mb-3">
              <label className="block text-sm mb-1 capitalize">{field}</label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}
          <div className="mb-3">
            <label className="block text-sm mb-1">Observações e Notas de Campo</label>
            <textarea
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Upload de Imagens */}
        <div className="col-span-3">
          <h2 className="font-semibold mb-3">Documentação Fotográfica</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagem}
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">Máximo 15 imagens</p>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          onClick={salvarColeta}
          className="flex items-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Coleta
        </button>
      </div>
    </div>
  );
}

export default NovaColeta;
