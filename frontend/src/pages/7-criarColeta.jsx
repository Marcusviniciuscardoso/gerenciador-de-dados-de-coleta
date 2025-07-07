import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { obterUsuarioLogado } from '../services/usuarioService';
import { getProjetoById } from '../services/projetoService';
import { criarColeta } from '../services/coletaService';

function NovaColeta() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [projeto, setProjeto] = useState({});
  const [form, setForm] = useState({
    local: '',
    latitude: '',
    longitude: '',
    dataColeta: '',
    hora_inicio: '',
    hora_fim: '',
    observacoes: '',
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const usuarioResp = await obterUsuarioLogado();
        setUsuario(usuarioResp.data);

        const projetoResp = await getProjetoById(id);
        const projetoData = Array.isArray(projetoResp.data)
          ? projetoResp.data[0]
          : projetoResp.data;
        setProjeto(projetoData);
      } catch (err) {
        console.error(err);
        alert("Erro ao buscar dados.");
      }
    };
    carregarDados();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const salvarColeta = async () => {
    try {
      const payload = {
        ...form,
        latitude: Number(parseFloat(form.latitude).toFixed(6)),
        longitude: Number(parseFloat(form.longitude).toFixed(6)),
        projetoId: id,
        coletado_por: usuario?.idUsuarios,
      };

      console.log("Payload final:", payload);

      await criarColeta(payload);
      alert('Coleta registrada com sucesso!');
      navigate(`/projetos/${id}`);
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
            Projeto: {projeto.nome || 'Carregando...'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-1">Local *</label>
          <input
            name="local"
            value={form.local}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Latitude *</label>
          <input
            type="number"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            step="0.000001"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Longitude *</label>
          <input
            type="number"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            step="0.000001"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Data da Coleta *</label>
          <input
            type="date"
            name="dataColeta"
            value={form.dataColeta}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Hora Início *</label>
          <input
            type="time"
            name="hora_inicio"
            value={form.hora_inicio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Hora Fim *</label>
          <input
            type="time"
            name="hora_fim"
            value={form.hora_fim}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Observações</label>
          <textarea
            name="observacoes"
            value={form.observacoes}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
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
