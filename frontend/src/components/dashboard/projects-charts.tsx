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
  palavrasChave: string; // separado por vírgula
  colaboradores: string; // separado por vírgula
  financiamento: string;
  orcamento: number;
  data_inicio: string; // formato ISO: "2025-11-15"
  data_fim: string; // formato ISO: "2026-06-30"
  imageLink: string;
  criado_por: number; // id do usuário criador
  status?: number; // 0, 1, 2, 3
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

export function ProjectsCharts({ data }: ProjectsChartsProps) {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [financiamentos, setFinanciamentos] = useState<financimentoInterface[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [statusData, setStatusData] = useState<
  { name: string; count: number; color: string }[]
  >([]);

  //Temas de pesquisa
  const [temasPesquisa, setTemasPesquisa] = useState<{ keyword: string; count: number }[]>([]);
  const navigate = useNavigate();

  const countByName = React.useMemo(() => {
    return Object.fromEntries(statusData.map((s) => [s.name, s.count]));
  }, [statusData]);


  const brl = (value:any) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    });
//TODO: Resolver problema de agrupamento de financiamentos
 useEffect(() => {
  const carregarProjetos = async () => {
    try {
      const usuarioResponse = await obterUsuarioLogado();
      setUsuario(usuarioResponse.data);

      const projetoResponse = await getProjetosByUsuarioId(
        usuarioResponse.data.idUsuarios
      );
      const projetosData = projetoResponse.data;
      setProjetos(projetosData);

      // === Definir status dinamicamente ===
      const agora = new Date();

      const statusContagem: Record<number, number> = {
        0: 0, // Não iniciado
        1: 0, // Em andamento
        2: 0, // Concluído
      };

      projetosData.forEach((p: Projeto) => {
        const dataInicio = new Date(p.data_inicio);
        const dataFim = new Date(p.data_fim);

        const financiamento: financimentoInterface = {
          instituicao: p.financiamento,
          count: +1,
        };
        
        setFinanciamentos(prev => {
          const index = prev.findIndex(f => f.instituicao === financiamento.instituicao);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = { ...updated[index], count: updated[index].count + 1 }; // ✅
            return updated;
          }
          return [...prev, financiamento];
        });
        
        let status = 0; // default: não iniciado

        if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
          // Caso datas inválidas
          status = 0;
        } else if (agora < dataInicio) {
          status = 0; // ainda não começou
        } else if (agora >= dataInicio && agora <= dataFim) {
          status = 1; // em andamento
        } else if (agora > dataFim) {
          status = 2; // já terminou
        }

        // incrementa contagem
        statusContagem[status] = (statusContagem[status] || 0) + 1;
      });

      // === Montar dados do gráfico ===
      const statusArray = [
        { name: "Não iniciado", color: "#22c55e", key: 0 },
        { name: "Em andamento", color: "#3b82f6", key: 1 },
        { name: "Concluído", color: "#f59e0b", key: 2 },
      ];

      const dadosPizza = statusArray.map((s) => ({
        name: s.name,
        color: s.color,
        count: statusContagem[s.key] || 0,
      }));

      setStatusData(dadosPizza);

      //Gráfico de barras - projetos por instituição

      //Gráfico de temas de pesquisa
      /*const temasContagem: Record<string, number> = {};
      projetosData.forEach((p: Projeto) => {
        const palavras = p.palavrasChave.split(",").map((kw) => kw.trim());
        palavras.forEach((kw) => {
          if (kw) {
            temasContagem[kw] = (temasContagem[kw] || 0) + 1;
          }
        });
      });
      const temasArray = Object.entries(temasContagem).map(([keyword, count]) => ({ keyword, count }));
      temasArray.sort((a, b) => b.count - a.count);
      setTemasPesquisa(temasArray.slice(0, 10)); // top 10*/

      projetosData.forEach((p: Projeto) => {
        const palavras = p.palavrasChave.split(",").map((kw) => kw.trim());
        palavras.forEach((kw) =>{
          if (!kw) return;

          setTemasPesquisa((prev) => {
            const index = prev.findIndex((item) => item.keyword === kw);

            // Se já existe, incrementa
            if (index !== -1) {
              const clone = [...prev];
              clone[index] = {
                ...clone[index],
                count: clone[index].count + 1,
              };
              return clone;
            }

            // Se não existe, cria com count = 1
            return [...prev, { keyword: kw, count: 1 }];
          })    // <- fecha só o callback, falta o ';'
        })      // <- fecha o forEach(kw)
      })


      console.log("📊 statusData:", dadosPizza);
    } catch (error) {
      console.error("Erro na obtenção dos projetos: ", error);
    }
  };

  carregarProjetos();
}, []);

  const maxFunding = Math.max(...data.byFunding.map((f:any)  => f.amount));
  const totalFunding = data.byFunding.reduce((acc:any, f:any) => acc + f.amount, 0);
  //const maxKeyword = Math.max(...data.topKeywords.map((k:any) => k.count));

  const maxOrcamento = Math.max(...projetos.map((p) => p.orcamento || 0));
  const totalOrcamento = projetos.reduce((acc, p) => Number(acc) + (Number(p.orcamento) || 0), 0)
  const maxPalavrasChave = Math.max(
    ...projetos.map((p) => p.palavrasChave.split(",").length)
  );

  return (
    <div className="p-6 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
      {/* ========== Card: Status dos Projetos (Pizza Dinâmica) ========== */}
      <div
        className="w-[35rem] p-10 rounded-3xl text-slate-600 bg-gradient-to-bl from-slate-200 to-slate-50
                     grid grid-cols-[1fr_auto] gap-6
                     [box-shadow:inset_-2px_2px_0_rgba(255,255,255,1),_-20px_20px_40px_rgba(0,0,0,.25)]"
      >
        <h3 className="text-2xl font-medium uppercase tracking-wide self-end">
          Status dos projetos
        </h3>
        <div className="text-5xl leading-none">
          <i className="fa-solid fa-laptop-code bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent"></i>
        </div>

        <div className="col-span-2">
          <h4 className="text-lg font-semibold mb-2"></h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <Legend
                  layout="vertical"
                  verticalAlign="top"
                  align="right"
                  formatter={(value) => (
                    <span className="text-sm">
                      {String(value)} ({countByName[String(value)] ?? 0})
                    </span>
                  )}
                />

                <Tooltip
                  formatter={(value, name) => [`${value} projetos`, name]}
                />
              </PieChart>

            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-2 h-[2px] bg-gradient-to-r from-rose-500 to-indigo-500"></div>
      </div>

      {/* ========== Card: Projetos por Instituição (Barras) ========== */}
      <div
        className="w-[41rem] p-10 rounded-3xl text-slate-600 bg-gradient-to-bl from-slate-200 to-slate-50
                     grid grid-cols-[1fr_auto] gap-6
                     [box-shadow:inset_-2px_2px_0_rgba(255,255,255,1),_-20px_20px_40px_rgba(0,0,0,.25)]"
      >
        <h3 className="text-2xl font-medium uppercase tracking-wide self-end">
          Projetos por Instituição
        </h3>
        <div className="text-5xl leading-none">
          <i className="fa-solid fa-laptop-code bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent"></i>
        </div>

        <div className="col-span-2">
          <h4 className="text-lg font-semibold mb-2"></h4>
          <div className="h-[300px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financiamentos} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} domain={[0, "dataMax"]} />
                <YAxis dataKey="instituicao" type="category" width={190} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#10b981"
                  label={{ position: "right", fill: "#374151", fontSize: 14 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-2 h-[2px] bg-gradient-to-r from-rose-500 to-indigo-500"></div>
      </div>


      {/* ========== Card: Fontes de Financiamento ========== */}
      {/*
      <div className="rounded-3xl border bg-white/70 backdrop-blur p-6 md:p-8 shadow-sm">
        <h3 className="text-2xl font-semibold text-gray-900">Fontes de Financiamento</h3>
        <p className="text-sm text-gray-500">Agências e valores investidos</p>

        <div className="mt-6 space-y-5">
          {data.byFunding.map((f:any) => {
            const pct = (f.amount / maxFunding) * 100;
            return (
              <div key={f.source} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-gray-800">{f.source}</div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-xs px-2.5 py-1">
                      {f.count} projeto{f.count > 1 ? "s" : ""}
                    </span>
                    <span className="text-sm font-medium text-gray-800">{brl(f.amount)}</span>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full"
                    style={{ width: `${pct}%` }}
                    aria-label={`${f.source} ${pct.toFixed(0)}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>


        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <span>Total investido</span>
          <span className="font-medium text-gray-800">{brl(totalFunding)}</span>
        </div>
      </div>*/}

        {/* ========== Card: Fontes de Financiamento 2========== */}
      <div className="rounded-3xl border bg-white/70 backdrop-blur p-6 md:p-8 shadow-sm">
        <h3 className="text-2xl font-semibold text-gray-900">Fontes de Financiamento</h3>
        <p className="text-sm text-gray-500">Agências e valores investidos</p>

        <div className="mt-6 space-y-5">
          {projetos.map((f:any) => {
            const pct = (f.orcamento / maxOrcamento) * 100;
            return (
              <div key={f.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-gray-800">{f.nome}</div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-xs px-2.5 py-1">
                      {f.palavrasChave.split(",").length} projeto{f.palavrasChave.split(",").length > 1 ? "s" : ""}
                    </span>
                    <span className="text-sm font-medium text-gray-800">{`R$${brl(f.orcamento)}`}</span>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full"
                    style={{ width: `${pct}%` }}
                    aria-label={`${f.id} ${pct.toFixed(0)}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <span>Total investido</span>
          <span className="font-medium text-gray-800">{brl(totalOrcamento)}</span>
        </div>
      </div>


      {/* ========== Card: Temas de Pesquisa ========== */}
      <div className="rounded-3xl border bg-white/70 backdrop-blur p-6 md:p-8 shadow-sm">
        <h3 className="text-2xl font-semibold text-gray-900">Temas de Pesquisa</h3>
        <p className="text-sm text-gray-500">Palavras-chave mais recorrentes</p>

        <div className="mt-6 space-y-5">
          {temasPesquisa.map((k:any) => {
            const pct = (k.count / 10) * 100;
            return (
              <div key={k.keyword} className="flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-gray-800 font-medium truncate">{k.keyword}</div>
                  <div className="mt-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${pct}%` }}
                      aria-label={`${k.keyword} ${pct.toFixed(0)}%`}
                    />
                  </div>
                </div>

                <span className="inline-flex shrink-0 items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                  {k.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========== Card: Evolução Temporal dos Projetos (Linha) ========== */}
      {/*<div className="w-[41rem] p-10 rounded-3xl text-slate-600 bg-gradient-to-bl from-slate-200 to-slate-50
                     grid grid-cols-[1fr_auto] gap-6
                     [box-shadow:inset_-2px_2px_0_rgba(255,255,255,1),_-20px_20px_40px_rgba(0,0,0,.25)]">
        <h3 className="text-2xl font-medium uppercase tracking-wide self-end">Programminng</h3>
        <div className="text-5xl leading-none">
          <i className="fa-solid fa-laptop-code bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent"></i>
        </div>

        <div className="col-span-2">
          <h4 className="text-lg font-semibold mb-2">Evolução dos projetos</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="created" stroke="#10b981" strokeWidth={2} name="Criados" />
                <Line type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={2} name="Concluídos" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

       <div className="col-span-2 h-[2px] bg-gradient-to-r from-rose-500 to-indigo-500"></div>
      </div>*/}
    </div>
  );
}
