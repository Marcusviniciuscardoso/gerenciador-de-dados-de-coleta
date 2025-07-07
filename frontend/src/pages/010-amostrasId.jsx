import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Edit, Trash } from 'lucide-react';
import { getAmostraById, deletarAmostra } from '../services/amostraService';

function AmostraDetalhes() {
  const { projetoId, coletaId, amostraId } = useParams();
  const navigate = useNavigate();

  const [amostra, setAmostra] = useState(null);

  useEffect(() => {
  const fetchAmostra = async () => {
    try {
      const response = await getAmostraById(coletaId);
      console.log("Olha o response: ", response);

      if (Array.isArray(response.data)) {
        // Filtra apenas a amostra cujo id é o mesmo da URL
        const encontrada = response.data.find(
          (a) => String(a.idAmostras) === String(amostraId)
        );

        if (!encontrada) {
          alert("Amostra não encontrada!");
        } else {
          setAmostra(encontrada);
        }
      } else {
        // Caso venha objeto único, verifica se o id bate
        if (String(response.data.idAmostras) === String(amostraId)) {
          setAmostra(response.data);
        } else {
          alert("Amostra não encontrada!");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar amostra:", error);
      alert("Erro ao carregar a amostra.");
    }
  };

  fetchAmostra();
}, [coletaId, amostraId]);


  const handleDelete = async () => {
    if (window.confirm('Deseja realmente excluir esta amostra?')) {
      await deletarAmostra(amostraId);
      alert('Amostra excluída!');
      navigate(`/projetos/${projetoId}/coletas/${coletaId}`);
    }
  };

  if (!amostra) {
    return <p className="p-8">Carregando...</p>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Amostra: {amostra.codigo}
          </h1>
          <p className="text-gray-600">
            Coleta ID: {coletaId}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 rounded border">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </button>
          <button className="p-2 border rounded hover:bg-gray-100">
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/projetos/${projetoId}/coletas/${coletaId}/amostras/${amostraId}/editar`)}
            className="p-2 border rounded hover:bg-gray-100"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 border rounded hover:bg-red-100"
          >
            <Trash className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      <div className="border rounded shadow p-6 mb-8">
        <p><strong>Descrição:</strong> {amostra.descricao}</p>
        <p><strong>Tipo:</strong> {amostra.tipoAmostra}</p>
        <p><strong>Quantidade:</strong> {amostra.quantidade}</p>
        <p><strong>Recipiente:</strong> {amostra.recipiente}</p>
        <p><strong>Preservação:</strong> {amostra.metodoPreservacao}</p>
        <p><strong>Observações:</strong> {amostra.observacoes}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Documentação Fotográfica</h2>
        <div className="flex gap-4">
          {amostra.imageLink && (
            <img
              src={amostra.imageLink}
              alt="Imagem"
              className="w-32 h-32 object-cover rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AmostraDetalhes;
