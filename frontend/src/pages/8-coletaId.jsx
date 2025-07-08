import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getColetaById, atualizarColeta, deletarColeta } from '../services/coletaService';
import { getAmostraById } from '../services/amostraService';
import { ArrowLeft} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


function Coleta() {
  const { id, coletaId } = useParams();
  const navigate = useNavigate();

  const [modoEdicao, setModoEdicao] = useState(false);
  const [coleta, setColeta] = useState(null);
  const [amostras, setAmostras] = useState([]);

  const exportarColetaParaXLSX = () => {
  if (!coleta) {
    alert('Nenhuma coleta carregada para exportar.');
    return;
  }

  // Aba Coleta (dados únicos)
  const coletaSheet = [
    {
      idColetas: coleta.idColetas,
      projetoId: coleta.projetoId,
      local: coleta.local,
      data: coleta.data,
      hora_inicio: coleta.hora_inicio,
      hora_fim: coleta.hora_fim,
      latitude: coleta.latitude,
      longitude: coleta.longitude,
      observacoes: coleta.observacoes,
    },
  ];

  // Aba Amostras
  const amostrasSheet = amostras.map((a) => ({
    idAmostras: a.idAmostras,
    coletaId: a.coletaId,
    codigo: a.codigo,
    descricao: a.descricao,
    tipoAmostra: a.tipoAmostra,
    quantidade: a.quantidade,
    recipiente: a.recipiente,
    metodoPreservacao: a.metodoPreservacao,
    validade: a.validade,
    identificacao_final: a.identificacao_final,
    observacoes: a.observacoes,
    imageLink: a.imageLink,
  }));

  const wb = XLSX.utils.book_new();

  const wsColeta = XLSX.utils.json_to_sheet(coletaSheet);
  XLSX.utils.book_append_sheet(wb, wsColeta, 'Coleta');

  const wsAmostras = XLSX.utils.json_to_sheet(amostrasSheet);
  XLSX.utils.book_append_sheet(wb, wsAmostras, 'Amostras');

  const excelBuffer = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'array',
  });

  const blob = new Blob([excelBuffer], {
    type:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `Coleta_${coleta.idColetas || 'dados'}.xlsx`);
};


  useEffect(() => {
    const carregarColeta = async () => {
      try {
        const response = await getColetaById(id);
        console.log("Coletas carregadas:", response);

        if (Array.isArray(response.data)) {
          const coletaEncontrada = response.data.find(
            (c) => String(c.idColetas) === String(coletaId)
          );

          if (!coletaEncontrada) {
            alert("Coleta não encontrada.");
          } else {
            setColeta(coletaEncontrada);

            const amostrasResp = await getAmostraById(coletaId);
            console.log("Amostras carregadas:", amostrasResp);

            setAmostras(Array.isArray(amostrasResp.data) ? amostrasResp.data : []);
          }
        } else {
          console.error("Resposta inesperada. Esperava array de coletas.");
        }
      } catch (error) {
        console.error('Erro ao carregar coleta ou amostras:', error);
        alert('Erro ao carregar dados da coleta.');
      }
    };

    carregarColeta();
  }, [id, coletaId]);

  const handleChange = (e) => {
    setColeta({
      ...coleta,
      [e.target.name]: e.target.value
    });
  };

  const salvarEdicao = async () => {
    try {
      await atualizarColeta(coletaId, coleta);
      alert('Coleta atualizada com sucesso!');
      setModoEdicao(false);
    } catch (error) {
      console.error('Erro ao atualizar coleta:', error);
      alert('Erro ao atualizar a coleta.');
    }
  };

  const excluirColeta = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta coleta?')) {
      try {
        await deletarColeta(coletaId);
        alert('Coleta excluída com sucesso!');
        navigate(`/projetos/${coleta.projetoId}`);
      } catch (error) {
        console.error('Erro ao excluir coleta:', error);
        alert('Erro ao excluir a coleta.');
      }
    }
  };

  if (!coleta) {
    return <p className="p-8 text-gray-500">Carregando coleta...</p>;
  }

  const renderCampo = (label, nome, tipo = 'text') => {
    return (
      <p className="mb-2">
        <span className="font-semibold">{label}:</span>{' '}
        {modoEdicao ? (
          tipo === 'textarea' ? (
            <textarea
              name={nome}
              value={coleta[nome] || ''}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full mt-1"
            />
          ) : (
            <input
              type={tipo}
              name={nome}
              value={coleta[nome] || ''}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full mt-1"
            />
          )
        ) : (
          <span>{coleta[nome] || '—'}</span>
        )}
      </p>
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-3xl font-bold">Detalhes da Coleta</h2>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 rounded border">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </button>
          <button
            onClick={() => setModoEdicao(!modoEdicao)}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            {modoEdicao ? 'Cancelar' : 'Editar'}
          </button>
          {modoEdicao && (
            <button
              onClick={salvarEdicao}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Salvar
            </button>
          )}
          <button
            onClick={excluirColeta}
            className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-100"
          >
            Excluir
          </button>
          <button
            onClick={exportarColetaParaXLSX}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Exportar Planilha
          </button>
        </div>
      </div>

      <div className="border rounded shadow p-6 mb-8">
        {renderCampo('Local', 'local')}
        {renderCampo('Data da Coleta', 'data', 'date')}
        {renderCampo('Hora Início', 'hora_inicio', 'time')}
        {renderCampo('Hora Fim', 'hora_fim', 'time')}
        {renderCampo('Latitude', 'latitude')}
        {renderCampo('Longitude', 'longitude')}
        {renderCampo('Observações', 'observacoes', 'textarea')}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Amostras da Coleta</h3>
        <Link
          to={`/projetos/${id}/coletas/${coletaId}/amostras/novo`}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Nova Amostra
        </Link>
      </div>

      {amostras.length === 0 && (
        <p className="text-gray-500 mb-6">Nenhuma amostra registrada para esta coleta.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {amostras.map((amostra) => (
          <div
            key={amostra.idAmostras}
            className="border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <h4 className="text-lg font-semibold mb-2">{amostra.codigo}</h4>
            <p className="text-gray-700"><span className="font-semibold">Tipo:</span> {amostra.tipoAmostra}</p>
            <p className="text-gray-700"><span className="font-semibold">Quantidade:</span> {amostra.quantidade}</p>
            <p className="text-gray-700"><span className="font-semibold">Recipiente:</span> {amostra.recipiente}</p>
            <p className="text-gray-700"><span className="font-semibold">Método Preservação:</span> {amostra.metodoPreservacao}</p>
            <p className="text-gray-700"><span className="font-semibold">Validade:</span> {amostra.validade}</p>
            {amostra.identificacao_final && (
              <p className="text-gray-700"><span className="font-semibold">Identificação Final:</span> {amostra.identificacao_final}</p>
            )}
            {amostra.observacoes && (
              <p className="text-gray-500 mt-2">{amostra.observacoes}</p>
            )}

            <Link
              to={`/projetos/${id}/coletas/${coletaId}/amostras/${amostra.idAmostras}`}
              className="inline-block mt-4 text-sm text-blue-600 hover:underline"
            >
              Ver Detalhes
            </Link>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link to={`/projetos/${coleta.projetoId}`}>
          <button className="border px-4 py-2 rounded hover:bg-gray-100">
            Voltar ao Projeto
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Coleta;
