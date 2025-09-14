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

import type { DashboardStats } from "../../lib/dashboard-data";

interface ProjectsChartsProps {
  data: DashboardStats["projects"];
}

export function SamplesOverview({ data }: ProjectsChartsProps) {
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

      {/* Cards de amostras */}
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-red-100 text-red-800 shadow">
          <div className="flex justify-between items-center">
            <strong className="text-md">AM-2024-0156</strong>
            <span className="font-semibold">Expirou há 5 dias</span>
          </div>
          <p className="text-sm">Tecido foliar</p>
          <p className="text-xs text-red-600 mt-1">Venceu em: 14/01/2024</p>
        </div>

        <div className="p-4 rounded-lg bg-orange-100 text-orange-800 shadow">
          <div className="flex justify-between items-center">
            <strong className="text-md">AM-2024-0234</strong>
            <span className="font-semibold">2 dias restantes</span>
          </div>
          <p className="text-sm">Sementes</p>
          <p className="text-xs text-orange-600 mt-1">Vence em: 19/01/2024</p>
        </div>

        <div className="p-4 rounded-lg bg-yellow-100 text-yellow-800 shadow">
          <div className="flex justify-between items-center">
            <strong className="text-md">AM-2024-0187</strong>
            <span className="font-semibold">7 dias restantes</span>
          </div>
          <p className="text-sm">Casca</p>
          <p className="text-xs text-yellow-600 mt-1">Vence em: 24/01/2024</p>
        </div>
      </div>

      {/* Status dos projetos + Histograma */}
      <div className="space-y-10">
        {/* Pizza */}
        <div className="w-full max-w-3xl mx-auto p-10 rounded-3xl bg-gradient-to-bl from-slate-200 to-slate-50 shadow-md grid gap-6">
          <h3 className="text-2xl font-medium uppercase tracking-wide">Programming</h3>

          <h4 className="text-lg font-semibold mb-2">Status dos projetos</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.byStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Histograma */}
        <div className="p-6 rounded-3xl bg-white shadow-md">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Distribuição de Amostras por Faixa de Dias para Vencimento
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Número de amostras agrupadas por intervalo de dias até o vencimento
          </p>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.expirationHistogram}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="daysRange" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" name="Amostras" />
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
