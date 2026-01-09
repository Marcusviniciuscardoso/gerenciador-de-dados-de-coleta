import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Edit, Trash, Save } from 'lucide-react';
import { getAmostraById, deletarAmostra, atualizarAmostra } from '../services/amostraService';
import { getPresignedGetUrl } from '../services/uploadService'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function AmostraDetalhes() {
  const { projetoId, coletaId, amostraId } = useParams();
  const navigate = useNavigate();

  const [amostra, setAmostra] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  // ✅ TESTE R2 GET (sem vínculo com amostra)
  const TEST_KEY = "amostras/12/b4807f54-c4a4-47cb-8080-955d050aebd9.jpg"; // <-- troque pela sua key real
  const [testImgUrl, setTestImgUrl] = useState(null);
  const [testImgErr, setTestImgErr] = useState(null);

  const exportarAmostraParaXLSX = () => {
    if (!amostra) {
      alert('Nenhuma amostra carregada para exportar.');
      return;
    }

    const amostraSheet = [
      {
        idAmostras: amostra.idAmostras,
        coletaId: amostra.coletaId,
        codigo: amostra.codigo,
        descricao: amostra.descricao,
        tipoAmostra: amostra.tipoAmostra,
        quantidade: amostra.quantidade,
        recipiente: amostra.recipiente,
        metodoPreservacao: amostra.metodoPreservacao,
        validade: amostra.validade,
        identificacao_final: amostra.identificacao_final,
        observacoes: amostra.observacoes,
        imageLink: amostra.imageLink,
      }
    ];

    const wb = XLSX.utils.book_new();
    const wsAmostra = XLSX.utils.json_to_sheet(amostraSheet);
    XLSX.utils.book_append_sheet(wb, wsAmostra, 'Amostra');

    const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `Amostra_${amostra.codigo || 'dados'}.xlsx`);
  };

  useEffect(() => {
    const fetchAmostra = async () => {
      try {
        const response = await getAmostraById(coletaId);
        console.log("Olha o response: ", response);

        if (Array.isArray(response.data)) {
          const encontrada = response.data.find(
            (a) => String(a.idAmostras) === String(amostraId)
          );

          if (!encontrada) {
            alert("Amostra não encontrada!");
          } else {
            setAmostra(encontrada);
          }
        } else {
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

  // ✅ carrega a imagem de teste via presigned GET
  useEffect(() => {
    const carregarImagemTeste = async () => {
      try {
        setTestImgErr(null);
        setTestImgUrl(null);

        const resp = await getPresignedGetUrl(TEST_KEY);
        console.log("Presigned GET URL (teste):", resp?.data);

        // aceite "url" ou "downloadUrl" dependendo do que seu backend retornar
        const url = resp?.data?.url || resp?.data?.downloadUrl;
        if (!url) throw new Error("Backend não retornou 'url' no presign-get");

        setTestImgUrl(url);
      } catch (e) {
        console.error("Erro ao gerar presigned GET (teste):", e);
        setTestImgErr(e?.response?.data || e.message);
      }
    };

    carregarImagemTeste();
  }, []);

  const handleDelete = async () => {
    if (window.confirm('Deseja realmente excluir esta amostra?')) {
      try {
        await deletarAmostra(amostraId);
        alert('Amostra excluída!');
        navigate(`/projetos/${projetoId}/coletas/${coletaId}`);
      } catch (error) {
        console.error('Erro ao excluir amostra:', error);
        alert('Erro ao excluir amostra.');
      }
    }
  };

  const handleChange = (e) => {
    setAmostra({
      ...amostra,
      [e.target.name]: e.target.value
    });
  };

  const salvarEdicao = async () => {
    try {
      await atualizarAmostra(amostraId, amostra);
      alert('Amostra atualizada com sucesso!');
      setModoEdicao(false);
    } catch (error) {
      console.error('Erro ao atualizar amostra:', error);
      alert('Erro ao atualizar a amostra.');
    }
  };

  const renderCampo = (label, nome, tipo = 'text') => {
    return (
      <p className="mb-2">
        <span className="font-semibold">{label}:</span>{' '}
        {modoEdicao ? (
          tipo === 'textarea' ? (
            <textarea
              name={nome}
              value={amostra[nome] || ''}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full mt-1"
            />
          ) : (
            <input
              type={tipo}
              name={nome}
              value={amostra[nome] || ''}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full mt-1"
            />
          )
        ) : (
          <span>{amostra[nome] || '—'}</span>
        )}
      </p>
    );
  };

  if (!amostra) {
    return <p className="p-8">Carregando...</p>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {modoEdicao ? (
              <input
                type="text"
                name="codigo"
                value={amostra.codigo || ''}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              `Amostra: ${amostra.codigo}`
            )}
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
          {!modoEdicao && (
            <button
              onClick={() => setModoEdicao(true)}
              className="p-2 border rounded hover:bg-gray-100"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {modoEdicao && (
            <button
              onClick={salvarEdicao}
              className="p-2 border rounded bg-black text-white hover:bg-gray-800"
            >
              <Save className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-2 border rounded hover:bg-red-100"
          >
            <Trash className="w-4 h-4 text-red-500" />
          </button>
          <button
            onClick={exportarAmostraParaXLSX}
            className="p-2 border rounded hover:bg-gray-100"
          >
            Exportar Planilha
          </button>
        </div>
      </div>

      <div className="border rounded shadow p-6 mb-8">
        {renderCampo('Descrição', 'descricao', 'textarea')}
        {renderCampo('Tipo', 'tipoAmostra')}
        {renderCampo('Quantidade', 'quantidade')}
        {renderCampo('Recipiente', 'recipiente')}
        {renderCampo('Preservação', 'metodoPreservacao')}
        {renderCampo('Observações', 'observacoes', 'textarea')}
      </div>

      {/* ✅ TESTE R2 GET (sem vínculo com amostra) */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Documentação Fotográfica (TESTE R2 GET)</h2>

        {testImgErr && (
          <pre className="text-xs bg-red-50 text-red-700 p-3 rounded border border-red-200 mb-3 overflow-auto">
            {JSON.stringify(testImgErr, null, 2)}
          </pre>
        )}

        <div className="flex gap-4 items-center">
          {testImgUrl ? (
            <img
              src={testImgUrl}
              alt="Imagem teste R2"
              className="w-48 h-48 object-cover rounded border"
              onError={(e) => {
                console.error("Falha ao carregar IMG no browser", e);
              }}
            />
          ) : (
            <div className="w-48 h-48 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-sm border">
              Carregando imagem...
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2 break-all">
          key: {TEST_KEY}
        </p>
      </div>

      {/* ✅ SEÇÃO ORIGINAL (imageLink) */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Documentação Fotográfica (campo da amostra)</h2>
        <div className="flex gap-4">
          {modoEdicao ? (
            <input
              type="text"
              name="imageLink"
              value={amostra.imageLink || ''}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full"
              placeholder="Link da Imagem"
            />
          ) : (
            amostra.imageLink && (
              <img
                src={amostra.imageLink}
                alt="Imagem"
                className="w-32 h-32 object-cover rounded"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default AmostraDetalhes;