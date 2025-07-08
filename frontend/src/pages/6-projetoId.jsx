import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash } from 'lucide-react';
import { obterUsuarioLogado } from '../services/usuarioService';
import { getProjetoById, deletarProjeto, atualizarProjeto } from '../services/projetoService';
import { getColetaById } from '../services/coletaService';
import { getAmostraById } from '../services/amostraService';

function ProjetoIdMock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modoEdicao, setModoEdicao] = useState(false);
  const [projeto, setProjetos] = useState({});
  const [coletas, setColetas] = useState([]);
  const [amostras, setAmostras] = useState([]);
  const [usuario, setUsuario] = useState([]);

  useEffect(() => {
    const obterProjetoId = async () => {
      try {
        const usuarioResponse = await obterUsuarioLogado();
        setUsuario(usuarioResponse.data);

        const projetoResponse = await getProjetoById(id);
        console.log("projetoResponse com id aqui: ", projetoResponse.data);

        const projetoData = Array.isArray(projetoResponse.data)
          ? projetoResponse.data[0]
          : projetoResponse.data;

        console.log("ID do projeto:", projetoData?.idProjetos);

        setProjetos(projetoData);

        // BUSCA COLETAS
        const coletaResponse = await getColetaById(projetoData.idProjetos);
        const coletasArray = Array.isArray(coletaResponse.data)
          ? coletaResponse.data
          : [];

        setColetas(coletasArray);

        // BUSCA AMOSTRAS DE TODAS AS COLETAS
        const amostrasTotais = [];

        for (const coleta of coletasArray) {
          const amostraResponse = await getAmostraById(coleta.idColetas);
          if (Array.isArray(amostraResponse.data)) {
            amostrasTotais.push(...amostraResponse.data);
          } else if (amostraResponse.data) {
            amostrasTotais.push(amostraResponse.data);
          }
        }

        setAmostras(amostrasTotais);

        console.log("Olha o id: ", id);
        console.log("Usuario response: ", usuarioResponse);
        console.log("Projeto Response: ", projetoResponse);
        console.log("Coleta response: ", coletaResponse);
        console.log("Amostra response: ", amostrasTotais);
      } catch (error) {
        console.error("Erro na obtenção dos projetos, ", error);
      }
    };

    obterProjetoId();
  }, [id]);

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

  const salvarEdicao = async () => {
    try {
      await atualizarProjeto(id, projeto);
      alert('Projeto atualizado com sucesso!');
      setModoEdicao(false);
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      alert('Erro ao atualizar o projeto.');
    }
  };

  const excluirProjeto = async () => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await deletarProjeto(id);
        alert('Projeto excluído com sucesso!');
        navigate('/projetos');
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
        alert('Erro ao excluir o projeto. Tente novamente.');
      }
    }
  };

  const handleChange = (e) => {
    setProjetos({
      ...projeto,
      [e.target.name]: e.target.value
    });
  };

  const renderCampo = (label, nome, tipo = 'text') => {
    return (
      <div>
        <span className="font-semibold">{label}:</span>{' '}
        {modoEdicao ? (
          tipo === 'textarea' ? (
            <textarea
              name={nome}
              value={projeto[nome] || ''}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full mt-1"
            />
          ) : (
            <input
              type={tipo}
              name={nome}
              value={projeto[nome] || ''}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full mt-1"
            />
          )
        ) : (
          <span>{projeto[nome] || '—'}</span>
        )}
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-2">
            {modoEdicao ? (
              <input
                type="text"
                name="nome"
                value={projeto.nome || ''}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              projeto.nome
            )}
          </h1>
          <div className="mb-4">
            {modoEdicao ? (
              <textarea
                name="descricao"
                value={projeto.descricao || ''}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              <p className="text-gray-600">{projeto.descricao}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            {renderCampo('Objetivos', 'objetivos', 'textarea')}
            {renderCampo('Metodologia', 'metodologia', 'textarea')}
            {renderCampo('Resultados Esperados', 'resultadosEsperados', 'textarea')}
            {renderCampo('Palavras-chave', 'palavrasChave')}
            {renderCampo('Colaboradores', 'colaboradores')}
            {renderCampo('Financiamento', 'financiamento')}
            {renderCampo('Orçamento', 'orcamento')}
            {renderCampo('Data de Início', 'data_inicio', 'date')}
            {renderCampo('Data de Fim', 'data_fim', 'date')}
            {renderCampo('Link da Imagem', 'imageLink')}
          </div>
          {projeto.imageLink && !modoEdicao && (
            <div className="mt-4">
              <img
                src={projeto.imageLink}
                alt="Imagem do Projeto"
                className="max-w-xs rounded shadow"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => setModoEdicao(!modoEdicao)}
            className="flex items-center border rounded px-3 py-1 hover:bg-gray-100"
          >
            <Pencil className="w-4 h-4 mr-1" />
            {modoEdicao ? 'Cancelar' : 'Editar'}
          </button>
          {modoEdicao && (
            <button
              onClick={salvarEdicao}
              className="flex items-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Salvar
            </button>
          )}
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
          <p className="text-2xl">{amostras.length}</p>
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
          onClick={() => navigate(`coletas/novo/`)}
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
            key={coleta.idColetas}
            className="border rounded-lg p-4 flex flex-col md:flex-row justify-between"
          >
            <div>
              <h3 className="text-gray-600">{coleta.local}</h3>
              <p className="text-sm text-gray-500">
                {coleta.data} às {coleta.hora_inicio}
              </p>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {contarAmostrasPorColeta(coleta.idColetas)} amostras
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <button
                onClick={() => navigate(`/projetos/${id}/coletas/${coleta.idColetas}`)}
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
