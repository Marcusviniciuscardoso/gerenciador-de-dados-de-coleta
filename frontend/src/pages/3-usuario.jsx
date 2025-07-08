import React from 'react';
import { Pencil, Mail, Phone, School } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCredencialById } from '../services/credencialService';
import { obterUsuarioLogado, atualizarUsuario } from '../services/usuarioService';

function Usuario() {
  const [usuario, setUsuario] = useState({});
  const [credencial, setCredencial] = useState({});
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    const buscarDadosUsuario = async () => {
      try {
        console.log("Iniciando busca de usuário...");

        const usuarioResponse = await obterUsuarioLogado();
        console.log("Usuário retornado:", usuarioResponse.data);
        setUsuario(usuarioResponse.data);

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

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  const salvarEdicao = async () => {
    try {
      await atualizarUsuario(usuario.idUsuarios, usuario);
      alert('Perfil atualizado com sucesso!');
      setModoEdicao(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar o perfil.');
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModoEdicao(!modoEdicao)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            <Pencil size={16} />
            {modoEdicao ? 'Cancelar' : 'Editar Perfil'}
          </button>
          {modoEdicao && (
            <button
              onClick={salvarEdicao}
              className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100"
            >
              Salvar
            </button>
          )}
        </div>
      </div>

      {/* Dados do Usuário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <p className="flex items-center gap-2">
            <Mail size={16} /> {credencial.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={16} />{' '}
            {modoEdicao ? (
              <input
                type="text"
                name="telefone"
                value={usuario.telefone || ''}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              usuario.telefone || '—'
            )}
          </p>
          <p className="flex items-center gap-2">
            <School size={16} />{' '}
            {modoEdicao ? (
              <input
                type="text"
                name="instituicao"
                value={usuario.instituicao || ''}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              usuario.instituicao || '—'
            )}
          </p>
          <p className="flex items-center gap-2">
            Cargo:{' '}
            {modoEdicao ? (
              <input
                type="text"
                name="cargo"
                value={usuario.cargo || ''}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              usuario.cargo || '—'
            )}
          </p>
          <p className="text-gray-500">
            Membro desde {usuario.data_cadastro || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Usuario;
