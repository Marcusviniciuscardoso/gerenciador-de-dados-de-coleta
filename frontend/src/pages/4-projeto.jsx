import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash, Pencil } from 'lucide-react';
import { getProjetosByUsuarioId, deletarProjeto } from '../services/projetoService';
import { obterUsuarioLogado } from '../services/usuarioService';
import PageShell, { PageHeader } from '../components/layout/PageShell';
import { ButterflyIcon, MothIcon, BeetleIcon, DragonflyIcon, MushroomIcon, FlowerIcon, FernIcon, LeafIcon } from '../components/decor/Illustrations';

const ICONS = [ButterflyIcon, MothIcon, BeetleIcon, DragonflyIcon, MushroomIcon, FlowerIcon];
const TAXA = ['LEPIDOPTERA', 'COLEOPTERA', 'ODONATA', 'BRYOPHYTA', 'MAGNOLIOPHYTA', 'ARACHNIDA'];

function pad(n) { return String(n).padStart(3, '0'); }

function formatSince(date) {
  if (!date) return '';
  try {
    const d = new Date(date);
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `desde ${meses[d.getMonth()]}. de ${d.getFullYear()}`;
  } catch {
    return '';
  }
}

function ProjetoPageMock() {
  const [projetos, setProjetos] = useState([]);
  const [busca, setBusca] = useState('');
  const [usuario, setUsuario] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obter = async () => {
      try {
        const usuarioResponse = await obterUsuarioLogado();
        setUsuario(usuarioResponse.data);
        const projetoResponse = await getProjetosByUsuarioId(usuarioResponse.data.idUsuarios);
        setProjetos(projetoResponse.data);
      } catch (error) {
        console.error('Erro na obtenção dos projetos, ', error);
      }
    };
    obter();
  }, [usuario.idUsuarios]);

  const excluirProjeto = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await deletarProjeto(id);
        setProjetos(projetos.filter((p) => p.idProjetos !== id));
      } catch (error) {
        console.error('Erro ao excluir projeto:', error);
        alert('Ocorreu um erro ao tentar excluir o projeto.');
      }
    }
  };

  const projetosFiltrados = projetos.filter((p) =>
    (p.nome || '').toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <PageShell badge={{ number: '03', label: 'Lista de Projetos' }}>
      <PageHeader
        overline="seu caderno de campo"
        title="Projetos de pesquisa"
        subtitle="Gerencie suas investigações, coletas e amostras em um só lugar."
        actions={
          <>
            <button onClick={() => navigate('/admin')} className="btn-secondary">Área administrativa</button>
            <button onClick={() => navigate('novo')} className="btn-primary"><Plus className="w-4 h-4" /> Novo projeto</button>
          </>
        }
      />

      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-tan-dark absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar projeto pelo nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-notebook pl-10 italic font-script text-lg"
          />
        </div>
        <span className="text-xs tracking-widest uppercase text-olive border border-olive/40 rounded-full px-3 py-1.5 bg-paper-light">
          {projetosFiltrados.length} projetos
        </span>
      </div>

      {projetosFiltrados.length === 0 && (
        <div className="card-notebook text-center py-16">
          <ButterflyIcon size={64} className="mx-auto opacity-50" />
          <p className="text-olive-light mt-4 font-script text-xl">Nenhum projeto encontrado.</p>
          <p className="text-sm text-tan-dark mt-1">Comece registrando uma nova investigação.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetosFiltrados.map((projeto, i) => {
          const Icon = ICONS[i % ICONS.length];
          const taxon = TAXA[i % TAXA.length];
          return (
            <div
              key={projeto.idProjetos}
              className="bg-paper-light border border-tan/60 rounded-lg shadow-card overflow-hidden hover:shadow-notebook transition cursor-pointer flex flex-col"
              onClick={() => navigate(`/projetos/${projeto.idProjetos}`)}
            >
              {/* Header decorativo do card */}
              <div className="bg-sage-100 px-5 pt-4 pb-6 relative border-b border-tan/40">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] tracking-widest font-semibold uppercase text-olive border border-olive/40 rounded-full px-2.5 py-1 bg-paper-light">
                    {taxon}
                  </span>
                  <span className="font-script text-sage-600 text-base">nº {pad(i + 1)}</span>
                </div>
                <div className="flex justify-center py-2 relative">
                  <Icon size={64} />
                  <FernIcon size={20} className="absolute right-2 bottom-0 opacity-40" />
                  <LeafIcon size={20} className="absolute left-2 top-0 opacity-30" />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="heading-serif text-xl mb-1.5">
                  {(projeto.nome || '').length > 35 ? (projeto.nome || '').slice(0, 35) + '...' : projeto.nome}
                </h3>
                <p className="text-sm text-olive-light/80 mb-4 line-clamp-2 flex-1">
                  {projeto.descricao}
                </p>

                <div className="border-t border-dashed border-tan pt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span><strong className="heading-serif text-base">{projeto.coletas ?? 0}</strong> <span className="text-olive-light">coletas</span></span>
                    <span className="text-tan-dark">|</span>
                    <span><strong className="heading-serif text-base">{projeto.amostras ?? 0}</strong> <span className="text-olive-light">amostras</span></span>
                  </div>
                  <span className="font-script text-sage-600 text-sm">{formatSince(projeto.data_inicio)}</span>
                </div>

                <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => navigate(`/projetos/${projeto.idProjetos}`)}
                    className="flex-1 text-sm border border-tan rounded-md px-3 py-1.5 hover:bg-tan-light text-olive transition"
                  >
                    Ver detalhes
                  </button>
                  <button
                    onClick={() => navigate(`/projetos/editar/${projeto.idProjetos}`)}
                    className="p-2 border border-tan rounded-md hover:bg-tan-light text-olive transition"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => excluirProjeto(projeto.idProjetos)}
                    className="p-2 border border-rust/40 rounded-md hover:bg-rust hover:text-paper-light text-rust transition"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

export default ProjetoPageMock;
