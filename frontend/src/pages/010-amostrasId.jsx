import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Edit, Trash } from 'lucide-react';

function AmostraDetalhes() {
  const { projetoId, coletaId, amostraId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Amostra: CP-001-F1</h1>
          <p className="text-gray-600">Coleta: Coccinellidae</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 rounded border">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
          <button className="p-2 border rounded hover:bg-gray-100">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-2 border rounded hover:bg-gray-100">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 border rounded hover:bg-red-100">
            <Trash className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      {/* Visão Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Quantidade</h2>
          <p className="text-2xl">2.5 g</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Temperatura</h2>
          <p className="text-2xl">30°C</p>
        </div>
        {/*<div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Análises</h2>
          <p className="text-2xl">2 Realizadas</p>
        </div>*/}
      </div>

      {/* Informações Básicas */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Informações Básicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p><strong>Código:</strong> CP-001-F1</p>
            <p><strong>Tipo:</strong> Inseto</p>
            <p><strong>Status:</strong> Armazenada</p>
            <p><strong>Preservação:</strong> Congelado</p>
            <p><strong>Descrição:</strong> Vermelha com pintas pretas</p>
          </div>
          <div>
            <p><strong>Coletado por:</strong> Dr. Maria Silva</p>
            {/*<p><strong>Processado por:</strong> Ana Costa</p>*/}
            {/*<p><strong>Tags:</strong> DNA, Morfologia, Taxonomia, Conservação</p>*/}
          </div>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Informações Adicionais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p><strong>pH do solo:</strong> 6.8</p>
            <p><strong>Umidade relativa:</strong> 75%</p>
            <p><strong>Altura da coleta:</strong> 1.5 m do solo</p>
          </div>
          <div>
            <p><strong>Coordenadas GPS:</strong> -22.4567, -43.1234</p>
            <p><strong>Observações:</strong> Inseto coletado da parte superior da árvore</p>
          </div>
        </div>
      </div>

      {/* Documentação */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Documentação Fotográfica</h2>
        <div className="flex gap-4">
          <img src="https://www.tgservices.com.br/wp-content/uploads/2021/10/26-10-2021.jpg" alt="Imagem 1" className="w-32 h-32 object-cover rounded" />
          <img src="https://www.trapp.com.br/wp-content/uploads/2024/11/3fa3ddb95af6e2b6d47c187d85f14135.jpg" alt="Imagem 2" className="w-32 h-32 object-cover rounded" />
        </div>
      </div>

      {/* Histórico, Exportação ou outros - se desejar
      <div className="flex gap-4">
        <button className="px-4 py-2 border rounded">Histórico</button>
        <button className="px-4 py-2 border rounded">Exportar</button>
      </div>*/}
    </div>
  );
}

export default AmostraDetalhes;
