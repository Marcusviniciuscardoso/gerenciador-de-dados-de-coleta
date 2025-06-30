import React from 'react';
import { Pencil, Mail, Phone, School /*, Folder, ClipboardList, Camera, Users*/ } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCredencialById } from '../services/credencialService';
import { obterUsuarioLogado } from '../services/usuarioService';

function Usuario() {
  const [usuario, setUsuario] = useState({});
  const [credencial, setCredencial] = useState({});
  
  useEffect(() => {
  const buscarDadosUsuario = async () => {
    try {
      console.log("Iniciando busca de usuário...");

      // 1. Busca o usuário logado
      const usuarioResponse = await obterUsuarioLogado();
      console.log("Usuário retornado:", usuarioResponse.data);
      setUsuario(usuarioResponse.data);

      // 2. Só chama a credencial se tiver usuário
      if (usuarioResponse.data?.idUsuarios) {
        const credencialResponse = await getCredencialById(usuarioResponse.data.idUsuarios);
        console.log("Credencial retornada:", credencialResponse.data);
        setCredencial(credencialResponse.data);
      }

    } catch (error) {
      console.error("Erro ao buscar usuário ou credencial:", error);
    }
  };

  buscarDadosUsuario();
}, []);


  console.log("vrau")
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-gray-600">Adicionar campo cargo</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          <Pencil size={16} />
          Editar Perfil
        </button>
      </div>

      {/* Dados do Usuário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <Mail size={16} /> {credencial.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={16} /> {usuario.telefone}
          </p>
          <p className="flex items-center gap-2">
            <School size={16} /> {usuario.instituicao}
          </p>
          <p className="text-gray-500">Membro desde {usuario.data_cadastro}</p>
        </div>

        {/* Estatísticas */}
        {/*
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <p className="text-lg font-semibold flex items-center gap-2">
              <Folder size={16} /> {usuario.estatisticas.projetos}
            </p>
            <p className="text-sm text-gray-600">Projetos criados</p>
          </div>
          <div className="border rounded p-4">
            <p className="text-lg font-semibold flex items-center gap-2">
              <ClipboardList size={16} /> {usuario.estatisticas.coletas}
            </p>
            <p className="text-sm text-gray-600">Coletas realizadas</p>
          </div>
          <div className="border rounded p-4">
            <p className="text-lg font-semibold flex items-center gap-2">
              <Camera size={16} /> {usuario.estatisticas.amostras}
            </p>
            <p className="text-sm text-gray-600">Amostras catalogadas</p>
          </div>
          
          <div className="border rounded p-4">
            <p className="text-lg font-semibold flex items-center gap-2">
              <Users size={16} /> {usuario.estatisticas.colaboracoes}
            </p>
            <p className="text-sm text-gray-600">Projetos colaborativos</p>
          </div>
        </div>
        */}

      </div>

      {/* Biografia */}
      {/*
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Biografia</h2>
        <p className="text-gray-700">{usuario.biografia}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {usuario.especializacoes.map((esp) => (
            <span
              key={esp}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700"
            >
              {esp}
            </span>
          ))}
        </div>
      </div>
      */}

      {/* Atividade Recente */}
      {/*
      <div>
        <h2 className="text-xl font-semibold mb-2">Atividade Recente</h2>
        <ul className="space-y-2">
          {usuario.atividades.map((a, index) => (
            <li key={index} className="border rounded p-3">
              <p className="font-medium">{a.descricao}</p>
              <p className="text-sm text-gray-500">{a.data}</p>
            </li>
          ))}
        </ul>
      </div>
      */}
    </div>
  );
}

export default Usuario;
