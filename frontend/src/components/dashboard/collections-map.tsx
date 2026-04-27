import React, { useEffect, useMemo, useState } from "react";
import { getProjetosByUsuarioId } from "../../services/projetoService";
import { getColetaById } from "../../services/coletaService";
import { getAmostraById } from "../../services/amostraService";
import { obterUsuarioLogado } from "../../services/usuarioService";

// ── Paleta do caderno ─────────────────────────────────────────────────────────
const C = {
  paper:      '#F2E8CF',
  paperLight: '#FAF3DF',
  sage100:    '#E2E6C5',
  sage200:    '#D9DBB6',
  sage600:    '#7A8A4F',
  olive:      '#3D4A2A',
  oliveDark:  '#2F3E1F',
  oliveLight: '#5A6B3F',
  rust:       '#9B5C3F',
  tan:        '#D9CBA1',
} as const;

// ── Interfaces ────────────────────────────────────────────────────────────────
export interface Usuario {
  idUsuarios: number;
  nome: string;
  email: string;
  instituicao: string;
  papel: string;
  credencial_id: number;
  criado_em?: string;
  atualizado_em?: string;
}

export interface Projeto {
  idProjetos: number;
  nome: string;
  descricao: string;
  objetivos: string;
  metodologia: string;
  resultadosEsperados: string;
  palavrasChave: string;
  colaboradores: string;
  financiamento: string;
  orcamento: number;
  data_inicio: string;
  data_fim: string;
  imageLink: string;
  criado_por: number;
  status?: number;
}

export interface Coleta {
  idColetas: number;
  projetoId: number;
  local: string;
  latitude: number;
  longitude: number;
  dataColeta: number;
  hora_inicio: number;
  hora_fim: number;
  observacoes: string;
  coletado_por: number;
}

export interface Amostra {
  idAmostras: number;
  coletaId: number;
  codigo: string;
  descricao: string;
  tipoAmostra: string;
  quantidade: string;
  recipiente: string;
  metodoPreservacao: string;
  validade: string;
  identificacao_final: string;
  observacoes: string;
  imageLink: string;
}

type ColetaComAmostras = Coleta & { amostras: Amostra[] };
type ProjetoComTudo = Projeto & {
  coletas: ColetaComAmostras[];
  totalAmostras: number;
};

// ── Componente ────────────────────────────────────────────────────────────────
export function CollectionsMap() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [coletas, setColetas] = useState<Coleta[]>([]);
  const [amostras, setAmostras] = useState<Amostra[]>([]);
  const [projetoSelecionadoId, setProjetoSelecionadoId] = useState<number | null>(null);

  useEffect(() => {
    const carregarTudo = async () => {
      try {
        const usuarioResponse = await obterUsuarioLogado();
        const usuarioData: Usuario = usuarioResponse.data;
        setUsuario(usuarioData);

        const projetosResponse = await getProjetosByUsuarioId(usuarioData.idUsuarios);
        const projetosData: Projeto[] = Array.isArray(projetosResponse.data)
          ? projetosResponse.data : [];
        setProjetos(projetosData);

        if (projetosData.length === 0) {
          setProjetoSelecionadoId(null);
          setColetas([]);
          setAmostras([]);
          return;
        }

        setProjetoSelecionadoId(projetosData[0].idProjetos);

        const respostasColetas = await Promise.all(
          projetosData.map((p) => getColetaById(p.idProjetos))
        );
        const coletasFlatten: Coleta[] = respostasColetas.flatMap((resp) =>
          Array.isArray(resp.data) ? resp.data : []
        );
        setColetas(coletasFlatten);

        if (coletasFlatten.length === 0) { setAmostras([]); return; }

        const coletaIds = coletasFlatten.map((c) => c.idColetas);
        const respostasAmostras = await Promise.all(
          coletaIds.map((id) => getAmostraById(id))
        );
        const amostrasFlatten: Amostra[] = respostasAmostras.flatMap((resp) => {
          const data = resp.data;
          if (Array.isArray(data)) return data;
          if (data) return [data];
          return [];
        });
        setAmostras(amostrasFlatten);
      } catch (error) {
        console.error("Erro no carregamento:", error);
      }
    };
    carregarTudo();
  }, []);

  const coletasPorProjeto = useMemo(() => {
    const map = new Map<number, Coleta[]>();
    for (const c of coletas) {
      const arr = map.get(c.projetoId) ?? [];
      arr.push(c);
      map.set(c.projetoId, arr);
    }
    return map;
  }, [coletas]);

  const amostrasPorColeta = useMemo(() => {
    const map = new Map<number, Amostra[]>();
    for (const a of amostras) {
      const arr = map.get(a.coletaId) ?? [];
      arr.push(a);
      map.set(a.coletaId, arr);
    }
    return map;
  }, [amostras]);

  const projetosComTudo = useMemo<ProjetoComTudo[]>(() => {
    return projetos.map((p) => {
      const coletasDoProjeto = coletasPorProjeto.get(p.idProjetos) ?? [];
      const coletasComAmostras: ColetaComAmostras[] = coletasDoProjeto.map((c) => ({
        ...c,
        amostras: amostrasPorColeta.get(c.idColetas) ?? [],
      }));
      const totalAmostras = coletasComAmostras.reduce((acc, c) => acc + c.amostras.length, 0);
      return { ...p, coletas: coletasComAmostras, totalAmostras };
    });
  }, [projetos, coletasPorProjeto, amostrasPorColeta]);

  const projetoSelecionado = useMemo(() => {
    if (projetoSelecionadoId == null) return null;
    return projetosComTudo.find((p) => p.idProjetos === projetoSelecionadoId) ?? null;
  }, [projetosComTudo, projetoSelecionadoId]);

  const coletasVisiveis = projetoSelecionado?.coletas ?? [];

  return (
    <div className="space-y-6">

      {/* ── Mapa placeholder ──────────────────────────────────────────────── */}
      <div className="card-notebook">
        {/* cabeçalho */}
        <div className="mb-5">
          <div className="font-script text-sage-600 text-sm italic leading-none mb-1">localização</div>
          <h3 className="heading-serif text-xl text-olive-dark">Pontos de Coleta</h3>
          <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
        </div>

        {/* Seletor de projeto */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-[10px] tracking-widest font-semibold uppercase text-olive">Projeto</span>
          <select
            className="input-notebook py-1.5 text-sm max-w-sm"
            value={projetoSelecionadoId ?? ""}
            onChange={(e) => setProjetoSelecionadoId(Number(e.target.value))}
          >
            {projetosComTudo.map((p) => (
              <option key={p.idProjetos} value={p.idProjetos}>
                {p.nome} — {p.coletas.length} coleta{p.coletas.length !== 1 ? 's' : ''} / {p.totalAmostras} amostra{p.totalAmostras !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Placeholder do mapa */}
        <div className="relative h-64 rounded-lg bg-sage-100 border border-tan/60 flex items-center justify-center overflow-hidden">
          {/* grade decorativa tipo mapa */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(${C.tan} 1px, transparent 1px),
                linear-gradient(90deg, ${C.tan} 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px',
            }}
          />
          <span className="font-script text-sage-600 text-xl opacity-60 z-10">
            mapa em breve…
          </span>

          {/* info overlay */}
          <div className="absolute bottom-3 left-3 bg-paper-light border border-tan rounded-md shadow-card p-3 text-sm z-10">
            <p className="text-olive-dark">
              Coletor: <strong>{usuario?.nome ?? '—'}</strong>
            </p>
            <p className="text-olive-light">
              Coletas visíveis: <strong className="text-olive-dark">{coletasVisiveis.length}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ── Lista de locais ───────────────────────────────────────────────── */}
      <div className="card-notebook">
        <div className="mb-5">
          <div className="font-script text-sage-600 text-sm italic leading-none mb-1">registros</div>
          <h3 className="heading-serif text-xl text-olive-dark">Principais Locais de Coleta</h3>
          <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
        </div>

        {coletasVisiveis.length === 0 ? (
          <p className="font-script text-sage-600 text-base">Nenhuma coleta encontrada para este projeto.</p>
        ) : (
          <div className="space-y-3">
            {coletasVisiveis.map((coleta) => {
              const codigos = coleta.amostras.slice(0, 2).map((a) => a.codigo);
              const extra   = coleta.amostras.length - codigos.length;

              return (
                <div
                  key={coleta.idColetas}
                  className="bg-paper border border-tan/60 rounded-lg p-4 hover:shadow-notebook transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-olive-dark">{coleta.local}</h4>
                    <span className="text-[10px] tracking-widest font-semibold uppercase border border-tan bg-paper-light text-olive rounded-full px-2.5 py-0.5">
                      {coleta.amostras.length} amostra{coleta.amostras.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <p className="text-xs text-olive-light/70 mb-3">
                    {coleta.latitude}, {coleta.longitude}
                  </p>

                  {codigos.length > 0 && (
                    <>
                      <p className="text-[10px] tracking-widest font-semibold uppercase text-olive mb-1">
                        Exemplos de amostras
                      </p>
                      <ul className="space-y-0.5">
                        {codigos.map((c) => (
                          <li key={c} className="font-script text-sage-600 text-sm italic">
                            {c}
                          </li>
                        ))}
                        {extra > 0 && (
                          <li className="text-xs text-olive-light/60">+{extra} outras</li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
