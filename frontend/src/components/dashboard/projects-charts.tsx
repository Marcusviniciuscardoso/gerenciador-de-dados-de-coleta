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
  Line,
  LineChart,
  Legend
} from "recharts";
import {
  getProjetosByUsuarioId,
  atualizarProjeto,
  deletarProjeto,
} from "../../services/projetoService";
import { obterUsuarioLogado } from "../../services/usuarioService";
import type { DashboardStats } from "../../lib/dashboard-data";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Paleta do caderno ────────────────────────────────────────────────────────
const C = {
  paper:      '#F2E8CF',
  paperLight: '#FAF3DF',
  sage100:    '#E2E6C5',
  sage200:    '#D9DBB6',
  sage300:    '#CFD4A5',
  sage400:    '#B8C49A',
  sage600:    '#7A8A4F',
  olive:      '#3D4A2A',
  oliveDark:  '#2F3E1F',
  oliveLight: '#5A6B3F',
  rust:       '#9B5C3F',
  rustLight:  '#B57A5C',
  tan:        '#D9CBA1',
  tanDark:    '#B8A878',
} as const;

// Cores do pie de status
const STATUS_COLORS = [C.sage300, C.sage600, C.rust];

// Estilo padrão de tooltip para todos os charts
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
  cursor: { fill: `${C.sage100}80` },
};

// ── Interfaces ────────────────────────────────────────────────────────────────
interface ProjectsChartsProps {
  data: DashboardStats["projects"];
}

export interface Projeto {
  idProjeto: number;
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

export interface financimentoInterface {
  instituicao: string;
  count: number;
}

// ── Componente principal ──────────────────────────────────────────────────────
export function ProjectsCharts({ data }: ProjectsChartsProps) {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [financiamentos, setFinanciamentos] = useState<financimentoInterface[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [statusData, setStatusData] = useState<{ name: string; count: number; color: string }[]>([]);
  const [temasPesquisa, setTemasPesquisa] = useState<{ keyword: string; count: number }[]>([]);

  const navigate = useNavigate();

  const countByName = React.useMemo(
    () => Object.fromEntries(statusData.map((s) => [s.name, s.count])),
    [statusData]
  );

  const brl = (value: any) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

  // TODO: Resolver problema de agrupamento de financiamentos
  useEffect(() => {
    const carregarProjetos = async () => {
      try {
        const usuarioResponse = await obterUsuarioLogado();
        setUsuario(usuarioResponse.data);

        const projetoResponse = await getProjetosByUsuarioId(usuarioResponse.data.idUsuarios);
        const projetosData = projetoResponse.data;
        setProjetos(projetosData);

        const agora = new Date();
        const statusContagem: Record<number, number> = { 0: 0, 1: 0, 2: 0 };

        projetosData.forEach((p: Projeto) => {
          const dataInicio = new Date(p.data_inicio);
          const dataFim    = new Date(p.data_fim);

          const financiamento: financimentoInterface = { instituicao: p.financiamento, count: +1 };
          setFinanciamentos(prev => {
            const index = prev.findIndex(f => f.instituicao === financiamento.instituicao);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = { ...updated[index], count: updated[index].count + 1 };
              return updated;
            }
            return [...prev, financiamento];
          });

          let status = 0;
          if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
            status = 0;
          } else if (agora < dataInicio) {
            status = 0;
          } else if (agora >= dataInicio && agora <= dataFim) {
            status = 1;
          } else if (agora > dataFim) {
            status = 2;
          }
          statusContagem[status] = (statusContagem[status] || 0) + 1;
        });

        const statusArray = [
          { name: "Não iniciado", color: STATUS_COLORS[0], key: 0 },
          { name: "Em andamento", color: STATUS_COLORS[1], key: 1 },
          { name: "Concluído",    color: STATUS_COLORS[2], key: 2 },
        ];
        const dadosPizza = statusArray.map((s) => ({
          name: s.name, color: s.color, count: statusContagem[s.key] || 0,
        }));
        setStatusData(dadosPizza);

        projetosData.forEach((p: Projeto) => {
          const palavras = p.palavrasChave.split(",").map((kw) => kw.trim());
          palavras.forEach((kw) => {
            if (!kw) return;
            setTemasPesquisa((prev) => {
              const index = prev.findIndex((item) => item.keyword === kw);
              if (index !== -1) {
                const clone = [...prev];
                clone[index] = { ...clone[index], count: clone[index].count + 1 };
                return clone;
              }
              return [...prev, { keyword: kw, count: 1 }];
            });
          });
        });

        console.log("📊 statusData:", dadosPizza);
      } catch (error) {
        console.error("Erro na obtenção dos projetos: ", error);
      }
    };
    carregarProjetos();
  }, []);

  const maxOrcamento  = Math.max(...projetos.map((p) => p.orcamento || 0));
  const totalOrcamento = projetos.reduce((acc, p) => Number(acc) + (Number(p.orcamento) || 0), 0);

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">

      {/* ── Status dos Projetos (Pizza) ──────────────────────────────────── */}
      <div className="card-notebook">
        {/* cabeçalho */}
        <div className="mb-5">
          <div className="font-script text-sage-600 text-sm italic leading-none mb-1">visão geral</div>
          <h3 className="heading-serif text-xl text-olive-dark">Status dos projetos</h3>
          <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                innerRadius={40}
                strokeWidth={2}
                stroke={C.paper}
                dataKey="count"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: C.oliveDark, fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
                    {String(value)}{' '}
                    <span style={{ color: C.oliveLight }}>({countByName[String(value)] ?? 0})</span>
                  </span>
                )}
              />
              <Tooltip
                formatter={(value, name) => [`${value} projetos`, name]}
                contentStyle={tooltipStyle.contentStyle}
                itemStyle={tooltipStyle.itemStyle}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 h-px bg-tan/60" />
      </div>

      {/* ── Projetos por Instituição (Barras horizontais) ─────────────────── */}
      <div className="card-notebook">
        <div className="mb-5">
          <div className="font-script text-sage-600 text-sm italic leading-none mb-1">distribuição</div>
          <h3 className="heading-serif text-xl text-olive-dark">Projetos por Instituição</h3>
          <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financiamentos} layout="vertical" margin={{ left: 4, right: 28 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.tan} vertical={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                domain={[0, "dataMax"]}
                tick={{ fill: C.oliveLight, fontSize: 11 }}
                axisLine={{ stroke: C.tan }}
                tickLine={false}
              />
              <YAxis
                dataKey="instituicao"
                type="category"
                width={180}
                tick={{ fill: C.oliveDark, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`${value} projeto(s)`, 'Quantidade']}
                contentStyle={tooltipStyle.contentStyle}
                itemStyle={tooltipStyle.itemStyle}
                cursor={{ fill: `${C.sage100}60` }}
              />
              <Bar
                dataKey="count"
                fill={C.sage600}
                radius={[0, 4, 4, 0]}
                label={{ position: "right", fill: C.oliveLight, fontSize: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 h-px bg-tan/60" />
      </div>

      {/* ── Fontes de Financiamento (barras horizontais manuais) ─────────── */}
      <div className="card-notebook">
        <div className="mb-5">
          <div className="font-script text-sage-600 text-sm italic leading-none mb-1">orçamento</div>
          <h3 className="heading-serif text-xl text-olive-dark">Fontes de Financiamento</h3>
          <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
          <p className="mt-1 text-xs text-olive-light/70">Agências e valores investidos</p>
        </div>

        <div className="space-y-4">
          {projetos.map((f) => {
            const pct = maxOrcamento > 0 ? (f.orcamento / maxOrcamento) * 100 : 0;
            return (
              <div key={f.idProjeto} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-olive-dark text-sm truncate">{f.nome}</div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] tracking-wider font-semibold uppercase border border-tan bg-paper text-olive rounded-full px-2.5 py-0.5">
                      {f.palavrasChave.split(",").length} kw
                    </span>
                    <span className="text-xs font-medium text-olive-dark">{brl(f.orcamento)}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-sage-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: C.sage600 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between text-xs border-t border-dashed border-tan pt-3">
          <span className="text-[10px] tracking-widest font-semibold uppercase text-olive">Total investido</span>
          <span className="heading-serif text-base text-olive-dark">{brl(totalOrcamento)}</span>
        </div>
      </div>

      {/* ── Temas de Pesquisa (barras horizontais manuais) ───────────────── */}
      <div className="card-notebook">
        <div className="mb-5">
          <div className="font-script text-sage-600 text-sm italic leading-none mb-1">palavras-chave</div>
          <h3 className="heading-serif text-xl text-olive-dark">Temas de Pesquisa</h3>
          <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
          <p className="mt-1 text-xs text-olive-light/70">Termos mais recorrentes nos projetos</p>
        </div>

        <div className="space-y-3">
          {temasPesquisa.map((k) => {
            const maxCount = Math.max(...temasPesquisa.map((t) => t.count), 1);
            const pct = (k.count / maxCount) * 100;
            return (
              <div key={k.keyword} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-olive-dark font-medium truncate mb-1">{k.keyword}</div>
                  <div className="h-1.5 rounded-full bg-sage-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: C.rust }}
                    />
                  </div>
                </div>
                <div className="w-7 h-7 shrink-0 rounded-full border border-tan bg-paper flex items-center justify-center text-xs font-semibold text-olive-dark">
                  {k.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Evolução Temporal (comentado — mantido para uso futuro) ─────── */}
      {/*
      <div className="card-notebook sm:col-span-2">
        <div className="mb-5">
          <div className="font-script text-sage-600 text-sm italic leading-none mb-1">temporal</div>
          <h3 className="heading-serif text-xl text-olive-dark">Evolução dos projetos</h3>
          <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.tan} />
              <XAxis dataKey="month" tick={{ fill: C.oliveLight, fontSize: 11 }} axisLine={{ stroke: C.tan }} tickLine={false} />
              <YAxis tick={{ fill: C.oliveLight, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle.contentStyle} itemStyle={tooltipStyle.itemStyle} cursor={{ stroke: C.tan }} />
              <Line type="monotone" dataKey="created"   stroke={C.sage600} strokeWidth={2} dot={{ fill: C.sage600,  r: 3 }} name="Criados"    />
              <Line type="monotone" dataKey="completed" stroke={C.rust}    strokeWidth={2} dot={{ fill: C.rust,     r: 3 }} name="Concluídos" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      */}

    </div>
  );
}
