import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getColetaById, atualizarColeta, deletarColeta } from '../services/coletaService';
import { getAmostraById } from '../services/amostraService';
import { Pencil, Trash, Plus } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import PageShell, { PageHeader, SectionHeading } from '../components/layout/PageShell';
import { ButterflyIcon, LeafIcon, FlowerIcon } from '../components/decor/Illustrations';

function Coleta() {
  const { id, coletaId } = useParams();
  const navigate = useNavigate();

  const [modoEdicao, setModoEdicao] = useState(false);
  const [coleta, setColeta] = useState(null);
  const [amostras, setAmostras] = useState([]);

  const exportarColetaParaXLSX = () => {
    if (!coleta) { alert('Nenhuma coleta carregada para exportar.'); return; }
    const coletaSheet = [{
      idColetas: coleta.idColetas, projetoId: coleta.projetoId, local: coleta.local,
      data: coleta.data, hora_inicio: coleta.hora_inicio, hora_fim: coleta.hora_fim,
      latitude: coleta.latitude, longitude: coleta.longitude, observacoes: coleta.observacoes,
    }];
    const amostrasSheet = amostras.map((a) => ({
      idAmostras: a.idAmostras, coletaId: a.coletaId, codigo: a.codigo,
      descricao: a.descricao, tipoAmostra: a.tipoAmostra, quantidade: a.quantidade,
      recipiente: a.recipiente, metodoPreservacao: a.metodoPreservacao, validade: a.validade,
      identificacao_final: a.identificacao_final, observacoes: a.observacoes, imageLink: a.imageLink,
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(coletaSheet), 'Coleta');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(amostrasSheet), 'Amostras');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Coleta_${coleta.idColetas || 'dados'}.xlsx`);
  };

  useEffect(() => {
    const carregar = async () => {
      try {
        const response = await getColetaById(id);
        if (Array.isArray(response.data)) {
          const coletaEncontrada = response.data.find((c) => String(c.idColetas) === String(coletaId));
          if (!coletaEncontrada) { alert('Coleta não encontrada.'); }
          else {
            setColeta(coletaEncontrada);
            const amostrasResp = await getAmostraById(coletaId);
            setAmostras(Array.isArray(amostrasResp.data) ? amostrasResp.data : []);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar coleta ou amostras:', error);
        alert('Erro ao carregar dados da coleta.');
      }
    };
    carregar();
  }, [id, coletaId]);

  const handleChange = (e) => setColeta({ ...coleta, [e.target.name]: e.target.value });

  const salvarEdicao = async () => {
    try {
      await atualizarColeta(coletaId, coleta);
      alert('Coleta atualizada com sucesso!');
      setModoEdicao(false);
    } catch (error) { console.error('Erro:', error); alert('Erro ao atualizar a coleta.'); }
  };

  const excluirColeta = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta coleta?')) {
      try {
        await deletarColeta(coletaId);
        alert('Coleta excluída com sucesso!');
        navigate(`/projetos/${coleta.projetoId}`);
      } catch (error) { console.error(error); alert('Erro ao excluir a coleta.'); }
    }
  };

  if (!coleta) {
    return (
      <PageShell badge={{ number: '06', label: 'Detalhe da Coleta' }}>
        <p className="font-script text-sage-600 text-xl">Carregando coleta...</p>
      </PageShell>
    );
  }

  const formatarDataLonga = (d) => {
    if (!d) return '';
    try {
      const data = new Date(d);
      return data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return d; }
  };

  return (
    <PageShell badge={{ number: '06', label: 'Detalhe da Coleta' }}>
      <PageHeader
        overline="saída de campo"
        title={coleta.local || 'Coleta'}
        subtitle={`${formatarDataLonga(coleta.data)}${coleta.hora_inicio ? ` · ${coleta.hora_inicio}${coleta.hora_fim ? `–${coleta.hora_fim}` : ''}` : ''}`}
        onBack={() => navigate(`/projetos/${coleta.projetoId}`)}
        backLabel="Voltar ao projeto"
        actions={
          <>
            {modoEdicao ? (
              <>
                <button onClick={() => setModoEdicao(false)} className="btn-secondary">Cancelar</button>
                <button onClick={salvarEdicao} className="btn-primary">Salvar</button>
              </>
            ) : (
              <button onClick={() => setModoEdicao(true)} className="btn-secondary"><Pencil className="w-4 h-4" /> Editar</button>
            )}
            <button onClick={exportarColetaParaXLSX} className="btn-secondary">Exportar planilha</button>
            <button onClick={excluirColeta} className="btn-danger"><Trash className="w-4 h-4" /> Excluir</button>
          </>
        }
      />

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* Cartão tipo "etiqueta" */}
        <div className="bg-paper-light border border-tan/60 rounded-lg p-6 shadow-card relative">
          <div className="absolute -top-2 left-6 right-6 h-3 bg-tan/40 rounded-sm"></div>
          <div className="text-center">
            <div className="text-[10px] tracking-widest font-semibold uppercase text-olive">COLETA Nº</div>
            <div className="font-script text-3xl text-olive-dark mt-1">{String(coleta.idColetas).padStart(4, '0')}</div>
          </div>
          <div className="font-script text-sage-600 text-base mt-4 space-y-1">
            <div>{coleta.local}</div>
            <div>{coleta.data}</div>
            <div>{coleta.latitude}, {coleta.longitude}</div>
          </div>
        </div>

        {/* Dados detalhados */}
        <div className="md:col-span-2 card-notebook">
          <SectionHeading overline="registro" title="Dados da coleta" className="mb-5" />
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Local" name="local" value={coleta.local} edit={modoEdicao} onChange={handleChange} />
            <Field label="Data" name="data" value={coleta.data} edit={modoEdicao} onChange={handleChange} type="date" />
            <Field label="Hora início" name="hora_inicio" value={coleta.hora_inicio} edit={modoEdicao} onChange={handleChange} type="time" />
            <Field label="Hora fim" name="hora_fim" value={coleta.hora_fim} edit={modoEdicao} onChange={handleChange} type="time" />
            <Field label="Latitude" name="latitude" value={coleta.latitude} edit={modoEdicao} onChange={handleChange} />
            <Field label="Longitude" name="longitude" value={coleta.longitude} edit={modoEdicao} onChange={handleChange} />
          </div>
          <div className="mt-5 border border-dashed border-tan rounded-md p-4 bg-paper">
            <div className="text-[10px] tracking-widest font-semibold uppercase text-olive mb-1">OBSERVAÇÕES</div>
            {modoEdicao ? (
              <textarea name="observacoes" value={coleta.observacoes || ''} onChange={handleChange} className="input-notebook" />
            ) : (
              <p className="font-script text-sage-600 text-base">{coleta.observacoes || '—'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Amostras */}
      <div className="flex items-end justify-between mb-4">
        <SectionHeading overline="espécimes" title="Amostras desta coleta" />
        <Link to={`/projetos/${id}/coletas/${coletaId}/amostras/novo`} className="btn-primary">
          <Plus className="w-4 h-4" /> Nova amostra
        </Link>
      </div>

      {amostras.length === 0 && (
        <div className="card-notebook text-center py-10">
          <p className="font-script text-sage-600 text-lg">Nenhuma amostra registrada para esta coleta.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {amostras.map((amostra) => (
          <Link
            key={amostra.idAmostras}
            to={`/projetos/${id}/coletas/${coletaId}/amostras/${amostra.idAmostras}`}
            className="bg-paper-light border border-tan/60 rounded-lg shadow-card hover:shadow-notebook transition overflow-hidden"
          >
            <div className="bg-paper relative px-5 py-6 border-b border-tan/40">
              <LeafIcon size={28} className="absolute top-2 left-2 opacity-30" />
              <FlowerIcon size={22} className="absolute top-3 right-3 opacity-30" />
              <div className="flex justify-center"><ButterflyIcon size={70} /></div>
            </div>
            <div className="p-5">
              <div className="font-script text-sage-600 text-base">{amostra.codigo}</div>
              <h4 className="heading-serif text-lg italic">{amostra.identificacao_final || amostra.descricao || '—'}</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {amostra.tipoAmostra && (
                  <span className="text-[10px] tracking-widest font-semibold uppercase text-olive border border-olive/40 rounded-full px-2 py-0.5 bg-paper">
                    {amostra.tipoAmostra}
                  </span>
                )}
                {amostra.quantidade && (
                  <span className="text-[10px] tracking-widest font-semibold uppercase text-rust border border-rust/40 rounded-full px-2 py-0.5 bg-paper">
                    {amostra.quantidade}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
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

export default Coleta;
