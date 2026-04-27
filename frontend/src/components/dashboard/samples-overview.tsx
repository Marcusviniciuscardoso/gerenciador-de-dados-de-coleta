import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import type { DashboardStats } from "../../lib/dashboard-data";
import { obterUsuarioLogado } from "../../services/usuarioService";
import { getProjetosByUsuarioId } from "../../services/projetoService";
import { getColetaById } from "../../services/coletaService";
import { getAmostraById } from "../../services/amostraService";

// ── Paleta do caderno ─────────────────────────────────────────────────────────
const C = {
  paper:      '#F2E8CF',
  paperLight: '#FAF3DF',
  sage100:    '#E2E6C5',
  sage200:    '#D9DBB6',
  sage300:    '#CFD4A5',
  sage600:    '#7A8A4F',
  olive:      '#3D4A2A',
  oliveDark:  '#2F3E1F',
  oliveLight: '#5A6B3F',
  rust:       '#9B5C3F',
  rustLight:  '#B57A5C',
  tan:        '#D9CBA1',
  tanDark:    '#B8A878',
} as const;

// Cores do pie de status (reutiliza paleta)
const STATUS_COLORS = [C.sage300, C.sage600, C.rust, C.rustLight, C.tanDark];

const tooltipStyle = {
  contentStyle: {
    background: C.paperLight,
    border: `1px solid ${C.tan}`,
    borderRadius: 6,
    boxShadow: '0 2px 12px rgba(61,74,42,0.08)',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 13,
    color: C.oliveDark,
  },
  itemStyle: { color: C.oliveLight },
};

// ── Interfaces ────────────────────────────────────────────────────────────────
interface ProjectsChartsProps {
  data: DashboardStats["projects"];
}

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

// ── Helpers de validade ───────────────────────────────────────────────────────
function getExpirationStatus(validade: string) {
  if (!validade) {
    return {
      statusText: "Sem data de validade",
      dateText: "",
      cardClasses: "bg-paper border border-tan/60 text-olive-dark",
      dateClasses: "text-olive-light/60",
    };
  }

  const hoje = new Date();
  const validadeDate = new Date(validade);

  if (Number.isNaN(validadeDate.getTime())) {
    return {
      statusText: "Data inválida",
      dateText: validade,
      cardClasses: "bg-paper border border-tan/60 text-olive-dark",
      dateClasses: "text-olive-light/60",
    };
  }

  const diffMs   = validadeDate.getTime() - hoje.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const dataFormatada = validadeDate.toLocaleDateString("pt-BR");

  if (diffDays < 0) {
    const dias = Math.abs(diffDays);
    return {
      statusText: `Expirou há ${dias} dia${dias === 1 ? "" : "s"}`,
      dateText: `Venceu em: ${dataFormatada}`,
      cardClasses: "bg-rust/10 border border-rust/40 text-rust",
      dateClasses: "text-rust/70",
    };
  }
  if (diffDays === 0) {
    return {
      statusText: "Expira hoje",
      dateText: `Vence em: ${dataFormatada}`,
      cardClasses: "bg-tan/30 border border-tan text-olive-dark",
      dateClasses: "text-olive-light",
    };
  }
  if (diffDays <= 7) {
    return {
      statusText: `${diffDays} dia${diffDays === 1 ? "" : "s"} restantes`,
      dateText: `Vence em: ${dataFormatada}`,
      cardClasses: "bg-sage-100 border border-sage-200 text-olive-dark",
      dateClasses: "text-olive-light",
    };
  }
  return {
    statusText: `${diffDays} dia${diffDays === 1 ? "" : "s"} restantes`,
    dateText: `Vence em: ${dataFormatada}`,
    cardClasses: "bg-sage-100 border border-sage-300 text-olive-dark",
    dateClasses: "text-olive-light",
  };
}

function getDiffDays(validade: string): number | null {
  if (!validade) return null;
  const hoje = new Date();
  const validadeDate = new Date(validade);
  if (Number.isNaN(validadeDate.getTime())) return null;
  return Math.round((validadeDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}

function normalizeText(value: unknown, fallback: string) {
  const s = String(value ?? "").trim();
  return s.length ? s : fallback;
}

// ── Componente ────────────────────────────────────────────────────────────────
export default function SamplesOverview({ data }: ProjectsChartsProps) {
  const [amostras, setAmostras] = useState<Amostra[]>([]);

  useEffect(() => {
    const carregarAmostras = async () => {
      try {
        const usuarioResponse = await obterUsuarioLogado();
        const usuarioData: Usuario = usuarioResponse.data;

        const projetosResponse = await getProjetosByUsuarioId(usuarioData.idUsuarios);
        const projetosData: Projeto[] = Array.isArray(projetosResponse.data)
          ? projetosResponse.data : [];

        console.log("Olha os projetosData (array): ", projetosData);

        if (projetosData.length === 0) {
          console.warn("Usuário não tem projetos. Parando fluxo.");
          setAmostras([]);
          return;
        }

        const projetoSelecionado = projetosData[0];

        const coletaResponse = await getColetaById(projetoSelecionado.idProjetos);
        const coletasData: Coleta[] = Array.isArray(coletaResponse.data)
          ? coletaResponse.data : [];

        console.log("Olha as coletasData (array): ", coletasData);

        if (coletasData.length === 0) {
          console.warn("Projeto não tem coletas. Parando fluxo.");
          setAmostras([]);
          return;
        }

        const coletasIds = coletasData.map((c) => c.idColetas);

        const respostasAmostras = await Promise.all(
          coletasIds.map((coletaId) => getAmostraById(coletaId))
        );

        const amostrasFlatten: Amostra[] = respostasAmostras.flatMap((resp) =>
          Array.isArray(resp.data) ? resp.data : resp.data ? [resp.data] : []
        );

        console.log("Olha as amostras (flatten): ", amostrasFlatten);
        setAmostras(amostrasFlatten);
      } catch (error) {
        console.error("Erro na obtenção das amostras: ", error);
      }
    };
    carregarAmostras();
  }, []);

  const amostrasCriticas = useMemo(() => {
    return [...amostras]
      .map((a) => ({ a, diff: getDiffDays(a.validade) }))
      .filter(({ diff }) => diff !== null && diff <= 7)
      .sort((x, y) => (x.diff ?? 99999) - (y.diff ?? 99999))
      .map(({ a }) => a);
  }, [amostras]);

  const samplesByPreservation = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of amostras) {
      const key = normalizeText(a.metodoPreservacao, "Não informado");
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([method, count]) => ({ method, count }))
      .sort((x, y) => y.count - x.count);
  }, [amostras]);

  const samplesByColeta = useMemo(() => {
    const map = new Map<number, number>();
    for (const a of amostras) {
      const id = Number(a.coletaId);
      if (Number.isFinite(id)) map.set(id, (map.get(id) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([coletaId, count]) => ({ coletaId, count }))
      .sort((x, y) => y.count - x.count);
  }, [amostras]);

  const resumo = useMemo(() => {
    const total   = amostras.length;
    const tipos   = new Set(amostras.map((a) => normalizeText(a.tipoAmostra, "")).filter(Boolean));
    const metodos = new Set(amostras.map((a) => normalizeText(a.metodoPreservacao, "")).filter(Boolean));
    return {
      totalAmostras:       total,
      tiposDiferentes:     tipos.size,
      proximasOuVencidas:  amostrasCriticas.length,
      metodosPreservacao:  metodos.size,
    };
  }, [amostras, amostrasCriticas]);

  const topPreservation = samplesByPreservation.slice(0, 6);
  const topColetas      = samplesByColeta.slice(0, 4);

  // Cards do resumo estatístico
  const statCards = [
    { label: 'Total de amostras',             value: resumo.totalAmostras,      accent: C.sage600 },
    { label: 'Tipos diferentes',              value: resumo.tiposDiferentes,    accent: C.oliveLight },
    { label: 'Críticas (≤7 dias ou vencidas)',value: resumo.proximasOuVencidas, accent: C.rust },
    { label: 'Métodos de preservação',        value: resumo.metodosPreservacao, accent: C.tanDark },
  ];

  return (
    <div className="space-y-6">

      {/* ── Amostras críticas ──────────────────────────────────────────────── */}
      <div className="card-notebook">
        <div className="mb-5">
          <div className="font-script text-rust text-sm italic leading-none mb-1">atenção</div>
          <h3 className="heading-serif text-xl text-olive-dark">
            Amostras Próximas ao Vencimento
          </h3>
          <div className="mt-2 h-px bg-gradient-to-r from-rust/40 to-transparent" />
        </div>

        {amostrasCriticas.length === 0 ? (
          <p className="font-script text-sage-600 text-base">
            Nenhuma amostra crítica (vencida ou vencendo em até 7 dias) encontrada.
          </p>
        ) : (
          <div className="space-y-3">
            {amostrasCriticas.map((amostra) => {
              const { statusText, dateText, cardClasses, dateClasses } =
                getExpirationStatus(amostra.validade);
              return (
                <div key={amostra.idAmostras} className={`p-4 rounded-lg ${cardClasses}`}>
                  <div className="flex justify-between items-center">
                    <strong className="font-medium">
                      {amostra.codigo || `AM-${amostra.idAmostras}`}
                    </strong>
                    <span className="text-[10px] tracking-widest font-semibold uppercase">
                      {statusText}
                    </span>
                  </div>
                  <p className="text-sm opacity-80 mt-0.5">
                    {amostra.tipoAmostra || amostra.descricao || "Amostra"}
                  </p>
                  {dateText && (
                    <p className={`text-xs mt-1 ${dateClasses}`}>{dateText}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Charts: Pie de status + Bar de preservação ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Pie */}
        <div className="card-notebook">
          <div className="mb-5">
            <div className="font-script text-sage-600 text-sm italic leading-none mb-1">classificação</div>
            <h3 className="heading-serif text-xl text-olive-dark">Status das Amostras</h3>
            <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.byStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  innerRadius={40}
                  strokeWidth={2}
                  stroke={C.paper}
                  dataKey="count"
                >
                  {data.byStatus.map((_: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle.contentStyle}
                  itemStyle={tooltipStyle.itemStyle}
                  cursor={false}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 h-px bg-tan/60" />
        </div>

        {/* Bar de preservação */}
        <div className="card-notebook">
          <div className="mb-5">
            <div className="font-script text-sage-600 text-sm italic leading-none mb-1">conservação</div>
            <h3 className="heading-serif text-xl text-olive-dark">Por Método de Preservação</h3>
            <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
            <p className="mt-1 text-xs text-olive-light/70">Número de amostras agrupadas por método (dados reais)</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={samplesByPreservation} margin={{ left: 4, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.tan} vertical={false} />
                <XAxis
                  dataKey="method"
                  tick={{ fill: C.oliveLight, fontSize: 11 }}
                  axisLine={{ stroke: C.tan }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: C.oliveLight, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle.contentStyle}
                  itemStyle={tooltipStyle.itemStyle}
                  cursor={{ fill: `${C.sage100}60` }}
                />
                <Bar dataKey="count" fill={C.sage600} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 h-px bg-tan/60" />
        </div>
      </div>

      {/* ── Métodos + Produtividade ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Métodos de preservação */}
        <div className="card-notebook">
          <div className="mb-5">
            <div className="font-script text-sage-600 text-sm italic leading-none mb-1">armazenamento</div>
            <h3 className="heading-serif text-xl text-olive-dark">Métodos de Preservação</h3>
            <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
          </div>

          {topPreservation.length === 0 ? (
            <p className="font-script text-sage-600 text-base">Nenhuma amostra cadastrada.</p>
          ) : (
            <div className="space-y-2">
              {topPreservation.map((item) => (
                <div
                  key={item.method}
                  className="flex justify-between items-center bg-paper border border-tan/60 rounded-lg px-4 py-3"
                >
                  <span className="text-sm text-olive-dark truncate">{item.method}</span>
                  <span className="text-[10px] tracking-widest font-semibold uppercase border border-tan bg-paper-light text-olive rounded-full px-2.5 py-0.5 ml-3 shrink-0">
                    {item.count} amostra{item.count === 1 ? "" : "s"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Produtividade por coleta */}
        <div className="card-notebook">
          <div className="mb-5">
            <div className="font-script text-sage-600 text-sm italic leading-none mb-1">eficiência</div>
            <h3 className="heading-serif text-xl text-olive-dark">Produtividade por Coleta</h3>
            <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
          </div>

          {topColetas.length === 0 ? (
            <p className="font-script text-sage-600 text-base">Nenhuma amostra cadastrada.</p>
          ) : (
            <div className="space-y-2">
              {topColetas.map((item, idx) => (
                <div
                  key={item.coletaId}
                  className="flex justify-between items-center bg-paper border border-tan/60 rounded-lg px-4 py-3"
                >
                  <span className="flex items-center gap-3 text-sm text-olive-dark">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full border border-tan bg-sage-100 text-olive text-xs font-semibold">
                      {idx + 1}
                    </span>
                    Coleta #{item.coletaId}
                  </span>
                  <span className="text-[10px] tracking-widest font-semibold uppercase border border-tan bg-paper-light text-olive rounded-full px-2.5 py-0.5 ml-3 shrink-0">
                    {item.count} amostra{item.count === 1 ? "" : "s"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Resumo estatístico ────────────────────────────────────────────── */}
      <div className="card-notebook">
        <div className="mb-5">
          <div className="font-script text-sage-600 text-sm italic leading-none mb-1">resumo</div>
          <h3 className="heading-serif text-xl text-olive-dark">Resumo Estatístico</h3>
          <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-paper border border-tan rounded-md p-4 relative shadow-card text-center"
            >
              {/* tira de fita decorativa */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-3 w-12 bg-tan/40 rounded-sm" />
              <div className="heading-serif text-3xl mt-1" style={{ color: s.accent }}>
                {s.value}
              </div>
              <div className="text-[10px] tracking-widest font-semibold uppercase text-olive mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
