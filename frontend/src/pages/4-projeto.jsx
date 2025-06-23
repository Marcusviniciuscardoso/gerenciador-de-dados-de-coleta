import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Folder, Trash, Pencil } from 'lucide-react';
import axios from '../services/api';

function ProjetoPage() {
  const [projetos, setProjetos] = useState([]);
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarProjetos();
  }, []);

  const carregarProjetos = async () => {
    try {
      const response = await axios.get('/projetos');
      setProjetos(response.data);
    } catch (error) {
      console.error('Erro ao carregar projetos', error);
    }
  };

  const excluirProjeto = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      await axios.delete(`/projetos/${id}`);
      carregarProjetos();
    }
  };

  const projetosFiltrados = projetos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projetos</h1>
          <p className="text-gray-600">Gerencie todos os seus projetos de pesquisa</p>
        </div>
        <button
          onClick={() => navigate('/novo-projeto')}
          className="flex items-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Buscar projetos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
        <button className="bg-black p-2 rounded text-white">
          <Search className="w-5 h-5" />
        </button>
      </div>

      <p className="mb-4 text-gray-600">
        {projetosFiltrados.length} projetos encontrados
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projetosFiltrados.map((projeto) => (
          <div key={projeto.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                {projeto.nome.length > 25 ? projeto.nome.slice(0, 25) + '...' : projeto.nome}
              </h2>
              <Folder className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-gray-600 mb-3">{projeto.descricao}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <p>{projeto.coletas} coletas</p>
              <p>{projeto.amostras} amostras</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Criado em {new Date(projeto.data_criacao).toLocaleDateString()}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate(`/projetos/${projeto.id}`)}
                className="flex-1 border rounded px-3 py-1 hover:bg-gray-100"
              >
                Ver Detalhes
              </button>
              <button
                onClick={() => navigate(`/projetos/editar/${projeto.id}`)}
                className="p-2 border rounded hover:bg-gray-100"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => excluirProjeto(projeto.id)}
                className="p-2 border rounded hover:bg-red-100"
              >
                <Trash className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjetoPage;
