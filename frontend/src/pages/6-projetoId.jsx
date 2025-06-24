/*import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import { Plus, Pencil, Trash, ArrowLeft } from 'lucide-react';

function ProjetoId() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projeto, setProjeto] = useState({});
  const [coletas, setColetas] = useState([]);
  const [amostras, setAmostras] = useState([]);

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      const resProjeto = await axios.get(`/projetos/${id}`);
      const resColetas = await axios.get('/coletas');
      const resAmostras = await axios.get('/amostras');

      setProjeto(resProjeto.data);
      setColetas(resColetas.data.filter((c) => c.projetoId == id));
      setAmostras(resAmostras.data);
    } catch (error) {
      console.error('Erro ao carregar dados', error);
    }
  };

  const contarAmostrasPorColeta = (coletaId) => {
    return amostras.filter((a) => a.coletaId === coletaId).length;
  };

  const obterDataMaisRecente = () => {
    const datas = coletas.map((c) => new Date(c.data));
    if (datas.length === 0) return 'Sem coletas';
    const maisRecente = new Date(Math.max(...datas));
    const agora = new Date();
    const diff = Math.floor((agora - maisRecente) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    return `${diff} dias atrás`;
  };

  const excluirProjeto = async () => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      await axios.delete(`/projetos/${id}`);
      navigate('/projetos');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{projeto.nome}</h1>
          <p className="text-gray-600">{projeto.descricao}</p>
          <p className="text-sm text-gray-500">
            Criado em {projeto.data_inicio} — Atualizado em {projeto.data_fim || 'N/A'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/projetos/editar/${id}`)}
            className="flex items-center border rounded px-3 py-1 hover:bg-gray-100"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Editar
          </button>
          <button
            onClick={excluirProjeto}
            className="flex items-center border rounded px-3 py-1 hover:bg-red-100 text-red-500"
          >
            <Trash className="w-4 h-4 mr-1" />
            Excluir
          </button>
        </div>
      </div>

      {/* Cards de resumo *//*}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Coletas Realizadas</h3>
          <p className="text-2xl">{coletas.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Amostras Coletadas</h3>
          <p className="text-2xl">
            {coletas.reduce((acc, c) => acc + contarAmostrasPorColeta(c.id), 0)}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Última Coleta</h3>
          <p className="text-2xl">{obterDataMaisRecente()}</p>
        </div>
      </div>

      {/* Cabeçalho de Coletas *//*}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Coletas Recentes</h2>
        <button
          onClick={() => navigate(`/coletas/nova/${id}`)}
          className="flex items-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Coleta
        </button>
      </div>

      {/* Lista de coletas *//*}
      <div className="space-y-4">
        {coletas.length === 0 && (
          <p className="text-gray-500">Nenhuma coleta registrada.</p>
        )}
        {coletas.map((coleta) => (
          <div
            key={coleta.id}
            className="border rounded-lg p-4 flex flex-col md:flex-row justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">{coleta.especie}</h3>
              <p className="text-gray-600">{coleta.local}</p>
              <p className="text-sm text-gray-500">
                {coleta.data} às {coleta.hora} — {coleta.responsavel}
              </p>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {contarAmostrasPorColeta(coleta.id)} amostras
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <button
                onClick={() => navigate(`/coletas/${coleta.id}`)}
                className="border px-3 py-1 rounded hover:bg-gray-100"
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjetoId;*/

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash } from 'lucide-react';

function ProjetoIdMock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projeto, setProjeto] = useState({});
  const [coletas, setColetas] = useState([]);
  const [amostras, setAmostras] = useState([]);

  useEffect(() => {
    carregarDadosMock();
  }, [id]);

  const carregarDadosMock = () => {
    const projetoMock = {
      id,
      nome: 'Projeto Mata Atlântica',
      descricao: 'Monitoramento da biodiversidade na região da Mata Atlântica.',
      data_inicio: '2024-05-01',
      data_fim: '2025-06-01',
    };

    const coletasMock = [
      {
        id: 1,
        projetoId: id,
        especie: 'Papilio demoleus',
        local: 'Parque Nacional',
        data: '2025-06-10',
        hora: '14:30',
        responsavel: 'Dr. Ana Costa',
      },
      {
        id: 2,
        projetoId: id,
        especie: 'Morpho menelaus',
        local: 'Reserva Biológica',
        data: '2025-06-15',
        hora: '10:00',
        responsavel: 'Lucas Pereira',
      },
    ];

    const amostrasMock = [
      { id: 1, coletaId: 1 },
      { id: 2, coletaId: 1 },
      { id: 3, coletaId: 2 },
      { id: 4, coletaId: 2 },
      { id: 5, coletaId: 2 },
    ];

    setProjeto(projetoMock);
    setColetas(coletasMock);
    setAmostras(amostrasMock);
  };

  const contarAmostrasPorColeta = (coletaId) => {
    return amostras.filter((a) => a.coletaId === coletaId).length;
  };

  const obterDataMaisRecente = () => {
    const datas = coletas.map((c) => new Date(c.data));
    if (datas.length === 0) return 'Sem coletas';
    const maisRecente = new Date(Math.max(...datas));
    const agora = new Date();
    const diff = Math.floor((agora - maisRecente) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    return `${diff} dias atrás`;
  };

  const excluirProjeto = () => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      alert('Projeto excluído (mock)');
      navigate('/projetos');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{projeto.nome}</h1>
          <p className="text-gray-600">{projeto.descricao}</p>
          <p className="text-sm text-gray-500">
            Criado em {projeto.data_inicio} — Atualizado em {projeto.data_fim || 'N/A'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/projetos/editar/${id}`)}
            className="flex items-center border rounded px-3 py-1 hover:bg-gray-100"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Editar
          </button>
          <button
            onClick={excluirProjeto}
            className="flex items-center border rounded px-3 py-1 hover:bg-red-100 text-red-500"
          >
            <Trash className="w-4 h-4 mr-1" />
            Excluir
          </button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Coletas Realizadas</h3>
          <p className="text-2xl">{coletas.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Amostras Coletadas</h3>
          <p className="text-2xl">
            {coletas.reduce((acc, c) => acc + contarAmostrasPorColeta(c.id), 0)}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Última Coleta</h3>
          <p className="text-2xl">{obterDataMaisRecente()}</p>
        </div>
      </div>

      {/* Cabeçalho de Coletas */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Coletas Recentes</h2>
        <button
          onClick={() => navigate(`/coletas/nova/${id}`)}
          className="flex items-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Coleta
        </button>
      </div>

      {/* Lista de coletas */}
      <div className="space-y-4">
        {coletas.length === 0 && (
          <p className="text-gray-500">Nenhuma coleta registrada.</p>
        )}
        {coletas.map((coleta) => (
          <div
            key={coleta.id}
            className="border rounded-lg p-4 flex flex-col md:flex-row justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">{coleta.especie}</h3>
              <p className="text-gray-600">{coleta.local}</p>
              <p className="text-sm text-gray-500">
                {coleta.data} às {coleta.hora} — {coleta.responsavel}
              </p>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {contarAmostrasPorColeta(coleta.id)} amostras
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <button
                onClick={() => navigate(`/coletas/${coleta.id}`)}
                className="border px-3 py-1 rounded hover:bg-gray-100"
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjetoIdMock;
