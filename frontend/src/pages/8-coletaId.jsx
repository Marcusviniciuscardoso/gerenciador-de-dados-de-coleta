import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getColetaById } from '../services/coletaService';
import { getAmostraById } from '../services/amostraService';

function Coleta() {
  const { id, coletaId } = useParams();
  const [coleta, setColeta] = useState(null);
  const [amostras, setAmostras] = useState([]);

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

  if (!coleta) {
    return <p className="p-8 text-gray-500">Carregando coleta...</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Detalhes da Coleta</h2>

      <div className="border rounded shadow p-6 mb-8">
        <p><span className="font-semibold">Local:</span> {coleta.local}</p>
        <p><span className="font-semibold">Data da Coleta:</span> {coleta.dataColeta}</p>
        <p><span className="font-semibold">Hora Início:</span> {coleta.hora_inicio}</p>
        <p><span className="font-semibold">Hora Fim:</span> {coleta.hora_fim}</p>
        <p><span className="font-semibold">Latitude:</span> {coleta.latitude}</p>
        <p><span className="font-semibold">Longitude:</span> {coleta.longitude}</p>
        {coleta.observacoes && (
          <p><span className="font-semibold">Observações:</span> {coleta.observacoes}</p>
        )}
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
