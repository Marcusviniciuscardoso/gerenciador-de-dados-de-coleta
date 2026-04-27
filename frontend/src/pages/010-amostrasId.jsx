import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Copy, Pencil, Trash } from 'lucide-react';
import { getAmostraById, deletarAmostra, atualizarAmostra } from '../services/amostraService';
import { getPresignedGetUrl } from '../services/uploadService';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import PageShell, { PageHeader, SectionHeading } from '../components/layout/PageShell';
import { ButterflyIcon, LeafIcon, FlowerIcon, FernIcon } from '../components/decor/Illustrations';

function AmostraDetalhes() {
  const { projetoId, coletaId, amostraId } = useParams();
  const navigate = useNavigate();

  const [amostra, setAmostra] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [imgErr, setImgErr] = useState(null);

  const exportarAmostraParaXLSX = () => {
    if (!amostra) { alert('Nenhuma amostra carregada para exportar.'); return; }
    const amostraSheet = [{
      idAmostras: amostra.idAmostras, coletaId: amostra.coletaId, codigo: amostra.codigo,
      descricao: amostra.descricao, tipoAmostra: amostra.tipoAmostra, quantidade: amostra.quantidade,
      recipiente: amostra.recipiente, metodoPreservacao: amostra.metodoPreservacao,
      validade: amostra.validade, identificacao_final: amostra.identificacao_final,
      observacoes: amostra.observacoes, imageLink: amostra.imageLink,
    }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(amostraSheet), 'Amostra');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Amostra_${amostra.codigo || 'dados'}.xlsx`);
  };

  const carregarImagemDaAmostra = async (amostraData) => {
    try {
      setImgErr(null); setImgUrl(null);
      if (!amostraData) return;
      const keyOuUrl = amostraData.imageLink;
      if (!keyOuUrl) return;
      if (keyOuUrl.startsWith('http')) { setImgUrl(keyOuUrl); return; }
      const resp = await getPresignedGetUrl(keyOuUrl);
      const url = resp?.data?.url || resp?.data?.downloadUrl;
      if (!url) throw new Error("Backend não retornou 'url' nem 'downloadUrl'");
      setImgUrl(url);
    } catch (e) {
      console.error('Erro ao gerar presigned GET:', e);
      setImgErr(e?.response?.data || e.message);
    }
  };

  useEffect(() => {
    const fetchAmostra = async () => {
      try {
        const response = await getAmostraById(coletaId);
        let encontrada = null;
        if (Array.isArray(response.data)) {
          encontrada = response.data.find((a) => String(a.idAmostras) === String(amostraId));
        } else if (response.data && String(response.data.idAmostras) === String(amostraId)) {
          encontrada = response.data;
        }
        if (!encontrada) { alert('Amostra não encontrada!'); }
        else {
          setAmostra(encontrada);
          carregarImagemDaAmostra(encontrada);
        }
      } catch (error) {
        console.error('Erro ao buscar amostra:', error);
        alert('Erro ao carregar a amostra.');
      }
    };
    fetchAmostra();
  }, [coletaId, amostraId]);

  const handleDelete = async () => {
    if (window.confirm('Deseja realmente excluir esta amostra?')) {
      try {
        await deletarAmostra(amostraId);
        alert('Amostra excluída!');
        navigate(`/projetos/${projetoId}/coletas/${coletaId}`);
      } catch (error) { console.error(error); alert('Erro ao excluir amostra.'); }
    }
  };

  const handleChange = (e) => setAmostra({ ...amostra, [e.target.name]: e.target.value });

  const salvarEdicao = async () => {
    try {
      await atualizarAmostra(amostraId, amostra);
      alert('Amostra atualizada com sucesso!');
      setModoEdicao(false);
      carregarImagemDaAmostra(amostra);
    } catch (error) { console.error(error); alert('Erro ao atualizar a amostra.'); }
  };

  if (!amostra) {
    return (
      <PageShell badge={{ number: '07', label: 'Detalhe da Amostra' }}>
        <p className="font-script text-sage-600 text-xl">Carregando...</p>
      </PageShell>
    );
  }

  return (
    <PageShell badge={{ number: '07', label: 'Detalhe da Amostra' }}>
      <PageHeader
        overline="espécime"
        title={<span className="italic">{amostra.identificacao_final || amostra.descricao || amostra.codigo}</span>}
        subtitle={<>Código: <strong className="text-olive-dark">{amostra.codigo}</strong></>}
        onBack={() => navigate(-1)}
        backLabel="Voltar à coleta"
        actions={
          <>
            <button className="btn-secondary"><Copy className="w-4 h-4" /> Duplicar</button>
            {modoEdicao ? (
              <>
                <button onClick={() => setModoEdicao(false)} className="btn-secondary">Cancelar</button>
                <button onClick={salvarEdicao} className="btn-primary">Salvar</button>
              </>
            ) : (
              <button onClick={() => setModoEdicao(true)} className="btn-secondary"><Pencil className="w-4 h-4" /> Editar</button>
            )}
            <button onClick={exportarAmostraParaXLSX} className="btn-secondary">Exportar planilha</button>
            <button onClick={handleDelete} className="btn-danger"><Trash className="w-4 h-4" /> Excluir</button>
          </>
        }
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Painel da imagem / etiqueta */}
        <div className="card-notebook">
          <div className="bg-paper border border-tan/60 rounded-lg p-6 relative">
            <LeafIcon size={28} className="absolute top-3 left-3 opacity-40" />
            <FlowerIcon size={24} className="absolute top-3 right-3 opacity-40" />
            <div className="flex justify-center items-center min-h-[260px]">
              {imgUrl ? (
                <img src={imgUrl} alt="Amostra" className="max-h-72 object-contain" />
              ) : (
                <ButterflyIcon size={160} />
              )}
            </div>
            {/* régua decorativa */}
            <div className="mt-4 border-t border-dashed border-tan pt-2 flex items-end justify-between text-[10px] text-tan-dark px-2">
              {Array.from({ length: 11 }).map((_, i) => (
                <span key={i} className="flex flex-col items-center">
                  <span className="block w-px h-2 bg-tan-dark" />
                </span>
              ))}
              <span className="font-script text-sage-600 text-base ml-2">cm</span>
            </div>
          </div>

          {/* Etiqueta tipo "tag" */}
          <div className="mt-5 mx-auto max-w-xs bg-paper border border-tan rounded-md p-4 shadow-card relative">
            <div className="absolute -top-2 left-6 right-6 h-3 bg-tan/40 rounded-sm"></div>
            <div className="font-script text-sage-600 text-base">{amostra.codigo}</div>
            <div className="heading-serif italic text-lg">{amostra.identificacao_final || '—'}</div>
            <div className="text-xs text-olive-light/80 mt-1">Coleta #{amostra.coletaId}</div>
            <div className="text-xs text-olive-light/80">M. Silva det. {new Date().getFullYear()}</div>
          </div>

          {/* Selo "catalogada" */}
          <div className="text-center mt-5">
            <div className="inline-flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-sage-600 flex items-center justify-center text-sage-600">
                ✓
              </div>
              <span className="font-script text-sage-600 text-base mt-1">CATALOGADA</span>
            </div>
          </div>
        </div>

        {/* Painel de dados */}
        <div className="space-y-6">
          <div className="card-notebook">
            <SectionHeading overline="descrição" title="Sobre o espécime" className="mb-4" />
            {modoEdicao ? (
              <textarea name="descricao" value={amostra.descricao || ''} onChange={handleChange} className="input-notebook" rows={4} />
            ) : (
              <p className="text-olive-light/90 leading-relaxed">{amostra.descricao || '—'}</p>
            )}
          </div>

          <div className="card-notebook">
            <SectionHeading overline="conservação" title="Armazenamento" className="mb-5" />
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Tipo" name="tipoAmostra" value={amostra.tipoAmostra} edit={modoEdicao} onChange={handleChange} />
              <Field label="Quantidade" name="quantidade" value={amostra.quantidade} edit={modoEdicao} onChange={handleChange} />
              <Field label="Recipiente" name="recipiente" value={amostra.recipiente} edit={modoEdicao} onChange={handleChange} />
              <Field label="Preservação" name="metodoPreservacao" value={amostra.metodoPreservacao} edit={modoEdicao} onChange={handleChange} />
              <Field label="Validade" name="validade" value={amostra.validade} edit={modoEdicao} onChange={handleChange} type="date" />
              <Field label="Identificação final" name="identificacao_final" value={amostra.identificacao_final} edit={modoEdicao} onChange={handleChange} />
            </div>
            <div className="mt-5 border border-dashed border-tan rounded-md p-4 bg-paper">
              <div className="text-[10px] tracking-widest font-semibold uppercase text-olive mb-1">OBSERVAÇÕES</div>
              {modoEdicao ? (
                <textarea name="observacoes" value={amostra.observacoes || ''} onChange={handleChange} className="input-notebook" />
              ) : (
                <p className="font-script text-sage-600 text-base">{amostra.observacoes || '—'}</p>
              )}
            </div>

            {modoEdicao && (
              <div className="mt-4">
                <label className="label-notebook">imageLink (key R2 ou URL)</label>
                <input name="imageLink" value={amostra.imageLink || ''} onChange={handleChange} className="input-notebook" />
              </div>
            )}
          </div>

          {imgErr && (
            <pre className="text-xs bg-rust/10 text-rust p-3 rounded border border-rust/30 overflow-auto">
              {JSON.stringify(imgErr, null, 2)}
            </pre>
          )}
        </div>
      </div>

      <FernIcon size={32} className="opacity-30 mt-10 mx-auto" />
    </PageShell>
  );
}

function Field({ label, name, value, edit, onChange, type = 'text' }) {
  return (
    <div>
      <div className="text-[10px] tracking-widest font-semibold uppercase text-olive mb-1">{label}</div>
      {edit ? (
        <input type={type} name={name} value={value || ''} onChange={onChange} className="input-notebook" />
      ) : (
        <div className="text-olive-dark border-b border-dashed border-tan pb-1">{value || '—'}</div>
      )}
    </div>
  );
}

export default AmostraDetalhes;
