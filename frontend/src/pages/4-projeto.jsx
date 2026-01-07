/*import React, { useEffect, useState } from 'react';
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

export default ProjetoPage;*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Folder, Trash, Pencil } from "lucide-react";
import { getProjetosByUsuarioId, deletarProjeto } from "../services/projetoService";
import { obterUsuarioLogado } from "../services/usuarioService";
import { getPresignedGetUrl } from "../services/uploadService";

function ProjetoPageMock() {
  const [projetos, setProjetos] = useState([]);
  const [busca, setBusca] = useState("");
  const [usuario, setUsuario] = useState({});
  const [imageUrls, setImageUrls] = useState({}); // { [idProjetos]: url }
  const navigate = useNavigate();

  useEffect(() => {
    const carregar = async () => {
      try {
        const usuarioResponse = await obterUsuarioLogado();
        const u = usuarioResponse.data;
        setUsuario(u);

        const projetoResponse = await getProjetosByUsuarioId(u.idUsuarios);
        const projs = projetoResponse.data || [];
        setProjetos(projs);

        // gerar urls de preview (presigned GET) pra quem tiver key
        const pairs = await Promise.all(
          projs.map(async (p) => {
            const key = p.imageKey || p.imageLink; // ajuste aqui pro seu campo
            if (!key) return [p.idProjetos, null];

            try {
              const resp = await getPresignedGetUrl(key);
              return [p.idProjetos, resp.data.url];
            } catch (e) {
              console.error("Falha ao gerar preview:", p.idProjetos, e);
              return [p.idProjetos, null];
            }
          })
        );

        const map = {};
        for (const [id, url] of pairs) {
          if (url) map[id] = url;
        }
        setImageUrls(map);
      } catch (error) {
        console.error("Erro na obtenção dos projetos:", error);
      }
    };

    carregar();
  }, []);

  const excluirProjeto = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        await deletarProjeto(id);
        setProjetos((prev) => prev.filter((p) => p.idProjetos !== id));
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
        alert("Ocorreu um erro ao tentar excluir o projeto.");
      }
    }
  };

  return (
    <div className="p-8">
      {/* ...seu header... */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projetos.map((projeto) => {
          const url = imageUrls[projeto.idProjetos];

          return (
            <div key={projeto.idProjetos} className="border rounded-lg p-4">
              {/* imagem */}
              <div className="mb-3">
                {url ? (
                  <img
                    src={url}
                    alt={projeto.nome}
                    className="w-full h-40 object-cover rounded-md"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-40 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    Sem imagem
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                  {projeto.nome?.length > 25 ? projeto.nome.slice(0, 25) + "..." : projeto.nome}
                </h2>
                <Folder className="w-5 h-5 text-gray-500" />
              </div>

              <p className="text-gray-600 mb-3">{projeto.descricao}</p>

              {/* ...resto do seu card... */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/projetos/${projeto.idProjetos}`)}
                  className="flex-1 border rounded px-3 py-1 hover:bg-gray-100"
                >
                  Ver Detalhes
                </button>
                <button
                  onClick={() => navigate(`/projetos/editar/${projeto.idProjetos}`)}
                  className="p-2 border rounded hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => excluirProjeto(projeto.idProjetos)}
                  className="p-2 border rounded hover:bg-red-100"
                >
                  <Trash className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjetoPageMock;


