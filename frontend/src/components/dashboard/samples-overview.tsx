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
import { useEffect, useState } from "react";
import type { DashboardStats } from "../../lib/dashboard-data";
import { obterUsuarioLogado } from "../../services/usuarioService";
import { getAmostraById } from "../../services/amostraService";

// Dados estáticos para o gráfico de métodos de preservação
const samplesByPreservation = [
  { method: "Nitrogênio líquido", count: 1245 },
  { method: "Sílica gel", count: 987 },
  { method: "Álcool 70%", count: 456 },
  { method: "Congelamento -80°C", count: 159 },
];

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

// Helper para montar texto e classes de status a partir da validade
function getExpirationStatus(validade: string) {
  if (!validade) {
    return {
      statusText: "Sem data de validade",
      dateText: "",
      cardClasses: "bg-gray-100 text-gray-800",
      dateClasses: "text-gray-600",
    };
  }

  const hoje = new Date();
  const validadeDate = new Date(validade);

  if (Number.isNaN(validadeDate.getTime())) {
    return {
      statusText: "Data inválida",
      dateText: validade,
      cardClasses: "bg-gray-100 text-gray-800",
      dateClasses: "text-gray-600",
    };
  }

  const diffMs = validadeDate.getTime() - hoje.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const dataFormatada = validadeDate.toLocaleDateString("pt-BR");

  if (diffDays < 0) {
    const dias = Math.abs(diffDays);
    return {
      statusText: `Expirou há ${dias} dia${dias === 1 ? "" : "s"}`,
      dateText: `Venceu em: ${dataFormatada}`,
      cardClasses: "bg-red-100 text-red-800",
      dateClasses: "text-red-600",
    };
  }

  if (diffDays === 0) {
    return {
      statusText: "Expira hoje",
      dateText: `Vence em: ${dataFormatada}`,
      cardClasses: "bg-orange-100 text-orange-800",
      dateClasses: "text-orange-600",
    };
  }

  if (diffDays <= 7) {
    return {
      statusText: `${diffDays} dia${diffDays === 1 ? "" : "s"} restantes`,
      dateText: `Vence em: ${dataFormatada}`,
      cardClasses: "bg-yellow-100 text-yellow-800",
      dateClasses: "text-yellow-600",
    };
  }

  return {
    statusText: `${diffDays} dia${diffDays === 1 ? "" : "s"} restantes`,
    dateText: `Vence em: ${dataFormatada}`,
    cardClasses: "bg-green-100 text-green-800",
    dateClasses: "text-green-600",
  };
}

export default function SamplesOverview({ data }: ProjectsChartsProps) {
  const [amostras, setAmostras] = useState<Amostra[]>([]);

  useEffect(() => {
    const carregarAmostras = async () => {
      try {
        const usuarioResponse = await obterUsuarioLogado();
        const usuarioData: Usuario = usuarioResponse.data;

        // Aqui você está usando idUsuarios para buscar amostras.
        // Ajuste se seu backend esperar outro ID (ex: id do projeto/coleta).
        const amostraResponse = await getAmostraById(usuarioData.idUsuarios);

        const amostraData = amostraResponse.data;
        const lista: Amostra[] = Array.isArray(amostraData)
          ? amostraData
          : [amostraData];

        setAmostras(lista);
        console.log("Olha as amostras: ", amostras)
      } catch (error) {
        console.error("Erro na obtenção das amostras: ", error);
      }
    };

    carregarAmostras();
  }, []);

  const brl = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    });

  return (
    <div className="p-4 space-y-8">
      {/* Título */}
      <h2 className="text-red-600 text-2xl font-semibold flex items-center gap-2">
        <i className="fa-solid fa-triangle-exclamation text-red-600"></i>
        Amostras Próximas ao Vencimento
      </h2>

      {/* Cards de amostras (DINÂMICOS) */}
      <div className="space-y-4">
        {amostras.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhuma amostra próxima ao vencimento encontrada.
          </p>
        ) : (
          amostras.map((amostra) => {
            const {
              statusText,
              dateText,
              cardClasses,
              dateClasses,
            } = getExpirationStatus(amostra.validade);

            return (
              <div
                key={amostra.idAmostras}
                className={`p-4 rounded-lg shadow ${cardClasses}`}
              >
                <div className="flex justify-between items-center">
                  <strong className="text-md">
                    {amostra.codigo || `AM-${amostra.idAmostras}`}
                  </strong>
                  <span className="font-semibold">{statusText}</span>
                </div>
                <p className="text-sm">
                  {amostra.tipoAmostra || amostra.descricao || "Amostra"}
                </p>
                {dateText && (
                  <p className={`text-xs mt-1 ${dateClasses}`}>{dateText}</p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Status dos projetos + Histograma */}
      <div className="space-y-10">
        {/* Pizza */}
        <div className="w-full max-w-3xl mx-auto p-10 rounded-3xl bg-gradient-to-bl from-slate-200 to-slate-50 shadow-md grid gap-6">
          <h3 className="text-2xl font-medium uppercase tracking-wide">
            Programming
          </h3>

          <h4 className="text-lg font-semibold mb-2">Status dos projetos</h4>

          <div className="h-[300px]">
            {/*percent*/}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.byStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(100 * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.byStatus.map((entry: any, index: any) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Histograma / métodos de preservação */}
        <div className="p-6 rounded-3xl bg-white shadow-md">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Distribuição de Amostras por Método de Preservação
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Número de amostras agrupadas por tipo de método utilizado para
            preservação
          </p>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={samplesByPreservation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Métodos de Preservação e Produtividade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Métodos de Preservação */}
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            🧊 Métodos de Preservação
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
              <span>Nitrogênio líquido</span>
              <span className="font-semibold text-sm">1245 amostras</span>
            </div>
            <div className="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
              <span>Sílica gel</span>
              <span className="font-semibold text-sm">987 amostras</span>
            </div>
            <div className="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
              <span>Álcool 70%</span>
              <span className="font-semibold text-sm">456 amostras</span>
            </div>
            <div className="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
              <span>Congelamento -80°C</span>
              <span className="font-semibold text-sm">159 amostras</span>
            </div>
          </div>
        </div>

        {/* Produtividade */}
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            📊 Produtividade por Projeto
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  1
                </span>
                Flora Amazônica
              </span>
              <span className="font-semibold text-sm">567 amostras</span>
            </div>
            <div className="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  2
                </span>
                Taxonomia Molecular
              </span>
              <span className="font-semibold text-sm">423 amostras</span>
            </div>
            <div className="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  3
                </span>
                Conservação PDBFF
              </span>
              <span className="font-semibold text-sm">298 amostras</span>
            </div>
            <div className="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  4
                </span>
                Etnobotânica
              </span>
              <span className="font-semibold text-sm">234 amostras</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo Estatístico */}
      <div className="rounded-lg border bg-white shadow-sm p-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <i className="fa-solid fa-square-poll-horizontal text-red-500"></i>
          Resumo Estatístico
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-3xl font-bold text-green-600">2847</p>
            <p className="text-sm text-gray-600">Total de amostras</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">7</p>
            <p className="text-sm text-gray-600">Tipos diferentes</p>
          </div>
          <div className="rounded-lg bg-orange-50 p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">3</p>
            <p className="text-sm text-gray-600">Próximas ao vencimento</p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">4</p>
            <p className="text-sm text-gray-600">Métodos de preservação</p>
          </div>
        </div>
      </div>
    </div>
  );
}
