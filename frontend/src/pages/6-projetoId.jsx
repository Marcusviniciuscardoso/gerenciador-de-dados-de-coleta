import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash } from 'lucide-react';
import { obterUsuarioLogado } from '../services/usuarioService';
import { getProjetoById, deletarProjeto, atualizarProjeto } from '../services/projetoService';
import { getColetaById } from '../services/coletaService';
import { getAmostraById } from '../services/amostraService';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import PageShell, { PageHeader, SectionHeading } from '../components/layout/PageShell';
import { ButterflyIcon, FernIcon, LeafIcon, FlowerIcon } from '../components/decor/Illustrations';

const MESES_ABREV = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

function ProjetoIdMock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modoEdicao, setModoEdicao] = useState(false);
  const [projeto, setProjetos] = useState({});
  const [coletas, setColetas] = useState([]);
  const [amostras, setAmostras] = useState([]);
  const [, setUsuario] = useState([]);

  const exportarProjetoParaXLSX = () => {
    const projetoSheet = [{
      idProjetos: projeto.idProjetos, nome: projeto.nome, descricao: projeto.descricao,
      objetivos: projeto.objetivos, metodologia: projeto.metodologia,
      resultadosEsperados: projeto.resultadosEsperados, palavrasChave: projeto.palavrasChave,
      colaboradores: projeto.colaboradores, financiamento: projeto.financiamento,
      orcamento: projeto.orcamento, data_inicio: projeto.data_inicio,
      data_fim: projeto.data_fim, imageLink: projeto.imageLink,
    }];
    const coletasSheet = coletas.map((c) => ({
      idColetas: c.idColetas, projetoId: c.projetoId, local: c.local, data: c.data,
      hora_inicio: c.hora_inicio, hora_fim: c.hora_fim, latitude: c.latitude,
      longitude: c.longitude, observacoes: c.observacoes,
    }));
    const amostrasSheet = amostras.map((a) => ({
      idAmostras: a.idAmostras, coletaId: a.coletaId, codigo: a.codigo,
      descricao: a.descricao, tipoAmostra: a.tipoAmostra, quantidade: a.quantidade,
      recipiente: a.recipiente, metodoPreservacao: a.metodoPreservacao,
      validade: a.validade, identificacao_final: a.identificacao_final,
      observacoes: a.observacoes, imageLink: a.imageLink,
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(projetoSheet), 'Projeto');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(coletasSheet), 'Coletas');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(amostrasSheet), 'Amostras');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Projeto_${projeto.nome || 'dados'}.xlsx`);
  };

  useEffect(() => {
    const obter = async () => {
      try {
        const usuarioResponse = await obterUsuarioLogado();
        setUsuario(usuarioResponse.data);
        const projetoResponse = await getProjetoById(id);
        const projetoData = Array.isArray(projetoResponse.data) ? projetoResponse.data[0] : projetoResponse.data;
        setProjetos(projetoData);
        const coletaResponse = await getColetaById(projetoData.idProjetos);
        const coletasArray = Array.isArray(coletaResponse.data) ? coletaResponse.data : [];
        setColetas(coletasArray);

        const amostrasTotais = [];
        for (const coleta of coletasArray) {
          const amostraResponse = await getAmostraById(coleta.idColetas);
          if (Array.isArray(amostraResponse.data)) amostrasTotais.push(...amostraResponse.data);
          else if (amostraResponse.data) amostrasTotais.push(amostraResponse.data);
        }
        setAmostras(amostrasTotais);
      } catch (error) {
        console.error('Erro na obtenção dos projetos, ', error);
      }
    };
    obter();
  }, [id]);

  const contarAmostrasPorColeta = (coletaId) => amostras.filter((a) => a.coletaId === coletaId).length;

  const obterDataMaisRecente = () => {
    const datas = coletas.map((c) => new Date(c.data));
    if (datas.length === 0) return '—';
    const maisRecente = new Date(Math.max(...datas));
    const agora = new Date();
    const diff = Math.floor((agora - maisRecente) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    return `${diff} dias`;
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
        console.error('Erro ao excluir projeto:', error);
        alert('Erro ao excluir o projeto. Tente novamente.');
      }
    }
  };

  const handleChange = (e) => setProjetos({ ...projeto, [e.target.name]: e.target.value });

  const formatarData = (d) => {
    if (!d) return '';
    const data = new Date(d);
    return { dia: data.getDate(), mes: MESES_ABREV[data.getMonth()] };
  };

  return (
    <PageShell badge={{ number: '05', label: 'Detalhe do Projeto' }}>
      <PageHeader
        title=""
        onBack={() => navigate('/projetos')}
        backLabel="Projetos"
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
            <button onClick={exportarProjetoParaXLSX} className="btn-secondary">Exportar planilha</button>
            <button onClick={excluirProjeto} className="btn-danger"><Trash className="w-4 h-4" /> Excluir</button>
          </>
        }
      />

      {/* Bloco hero do projeto */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-paper-light border border-tan/60 rounded-lg p-6 relative shadow-card">
          <LeafIcon size={36} className="absolute top-3 left-3 opacity-40" />
          <FlowerIcon size={28} className="absolute top-4 right-3 opacity-40" />
          <div className="flex items-center justify-center py-6">
            <ButterflyIcon size={120} />
          </div>
          <div className="text-center font-script text-sage-600 mt-2">Gerenciador de dados de coleta</div>
        </div>

        <div className="md:col-span-2">
          <span className="inline-block text-[10px] tracking-widest font-semibold uppercase text-olive border border-olive/40 rounded-full px-2.5 py-1 bg-paper-light mb-3">
            Gerenciador de dados de coleta
          </span>
          <h1 className="heading-serif text-4xl mb-2">
            {modoEdicao ? (
              <input type="text" name="nome" value={projeto.nome || ''} onChange={handleChange} className="input-notebook text-3xl" />
            ) : (
              projeto.nome
            )}
          </h1>
          {modoEdicao ? (
            <textarea name="descricao" value={projeto.descricao || ''} onChange={handleChange} className="input-notebook mb-4" />
          ) : (
            <p className="text-olive-light/80 mb-6">{projeto.descricao}</p>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="heading-serif text-3xl">{coletas.length}</div>
              <div className="text-[11px] tracking-widest uppercase text-olive-light/70">Coletas realizadas</div>
            </div>
            <div>
              <div className="heading-serif text-3xl">{amostras.length}</div>
              <div className="text-[11px] tracking-widest uppercase text-olive-light/70">Amostras catalogadas</div>
            </div>
            <div>
              <div className="heading-serif text-3xl">{obterDataMaisRecente()}</div>
              <div className="text-[11px] tracking-widest uppercase text-olive-light/70">Última saída</div>
            </div>
          </div>
        </div>
      </div>

      {/* Objetivos / Metodologia */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="card-notebook">
          <SectionHeading overline="propósito" title="Objetivos" className="mb-4" />
          {modoEdicao ? (
            <textarea name="objetivos" value={projeto.objetivos || ''} onChange={handleChange} className="input-notebook" rows={4} />
          ) : (
            <p className="text-olive-light/90 leading-relaxed">{projeto.objetivos || '—'}</p>
          )}
        </div>
        <div className="card-notebook">
          <SectionHeading overline="como" title="Metodologia" className="mb-4" />
          {modoEdicao ? (
            <textarea name="metodologia" value={projeto.metodologia || ''} onChange={handleChange} className="input-notebook" rows={4} />
          ) : (
            <p className="text-olive-light/90 leading-relaxed">{projeto.metodologia || '—'}</p>
          )}
        </div>
      </div>

      {modoEdicao && (
        <div className="card-notebook mb-10 space-y-4">
          <SectionHeading overline="metadados" title="Outros campos" />
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="label-notebook">Resultados esperados</label><input name="resultadosEsperados" value={projeto.resultadosEsperados || ''} onChange={handleChange} className="input-notebook" /></div>
            <div><label className="label-notebook">Palavras-chave</label><input name="palavrasChave" value={projeto.palavrasChave || ''} onChange={handleChange} className="input-notebook" /></div>
            <div><label className="label-notebook">Colaboradores</label><input name="colaboradores" value={projeto.colaboradores || ''} onChange={handleChange} className="input-notebook" /></div>
            <div><label className="label-notebook">Financiamento</label><input name="financiamento" value={projeto.financiamento || ''} onChange={handleChange} className="input-notebook" /></div>
            <div><label className="label-notebook">Orçamento</label><input name="orcamento" value={projeto.orcamento || ''} onChange={handleChange} className="input-notebook" /></div>
            <div><label className="label-notebook">Data início</label><input type="date" name="data_inicio" value={projeto.data_inicio || ''} onChange={handleChange} className="input-notebook" /></div>
            <div><label className="label-notebook">Data fim</label><input type="date" name="data_fim" value={projeto.data_fim || ''} onChange={handleChange} className="input-notebook" /></div>
            <div><label className="label-notebook">Link da imagem</label><input name="imageLink" value={projeto.imageLink || ''} onChange={handleChange} className="input-notebook" /></div>
          </div>
        </div>
      )}

      {projeto.imageLink && !modoEdicao && (
        <div className="mb-10">
          <img src={projeto.imageLink} alt="Imagem do Projeto" className="max-w-md rounded-lg shadow-card border border-tan/60" />
        </div>
      )}

      {/* Coletas recentes */}
      <div className="flex items-end justify-between mb-4">
        <SectionHeading overline="saídas de campo" title="Coletas recentes" />
        <button onClick={() => navigate('coletas/novo/')} className="btn-primary"><Plus className="w-4 h-4" /> Nova coleta</button>
      </div>

      <div className="space-y-3">
        {coletas.length === 0 && (
          <div className="card-notebook text-center py-10">
            <FernIcon size={40} className="mx-auto opacity-50" />
            <p className="font-script text-sage-600 text-lg mt-3">Nenhuma coleta registrada ainda.</p>
          </div>
        )}
        {coletas.map((coleta) => {
          const data = formatarData(coleta.data);
          return (
            <div
              key={coleta.idColetas}
              onClick={() => navigate(`/projetos/${id}/coletas/${coleta.idColetas}`)}
              className="card-notebook flex items-center gap-5 cursor-pointer hover:shadow-notebook transition"
            >
              <div className="w-16 h-16 rounded-full bg-sage-200 border border-olive/30 flex flex-col items-center justify-center shrink-0">
                <span className="heading-serif text-2xl leading-none">{data.dia || '—'}</span>
                <span className="text-[10px] tracking-widest text-olive-light">{data.mes || ''}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="heading-serif text-lg">{coleta.local}</h3>
                <div className="text-sm text-olive-light flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5">
                  <span>🕒 {coleta.hora_inicio}{coleta.hora_fim ? `–${coleta.hora_fim}` : ''}</span>
                  <span>📍 {coleta.latitude}, {coleta.longitude}</span>
                </div>
                {coleta.observacoes && (
                  <p className="font-script text-sage-600 text-base mt-1 line-clamp-1">{coleta.observacoes}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block text-[10px] tracking-widest font-semibold uppercase text-olive border border-olive/40 rounded-full px-2.5 py-1 bg-paper-light">
                  {contarAmostrasPorColeta(coleta.idColetas)} amostras
                </span>
                <div className="font-script text-sage-600 text-sm mt-2">ver detalhes →</div>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

export default ProjetoIdMock;
