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

export function ProjectsCharts({ data }: ProjectsChartsProps) {
  return (
    <div className="p-6 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      
      {/* Card - Gráfico de Pizza */}
      <div
        className="p-10 rounded-3xl text-slate-600 bg-gradient-to-bl from-slate-200 to-slate-50
                   grid grid-cols-[1fr_auto] gap-6
                   [box-shadow:inset_-2px_2px_0_rgba(255,255,255,1),_-20px_20px_40px_rgba(0,0,0,.25)]"
      >
        <h3 className="text-2xl font-medium uppercase tracking-wide self-end">
          Programming
        </h3>

        <div className="text-5xl leading-none">
          <i className="fa-solid fa-laptop-code bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent"></i>
        </div>

        <div className="col-span-2">
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

        <div className="col-span-2 h-[2px] bg-gradient-to-r from-rose-500 to-indigo-500"></div>
      </div>

      {/* Card - Gráfico de Barras */}
      <div
        className="w-[50rem] p-10 rounded-3xl text-slate-600 bg-gradient-to-bl from-slate-200 to-slate-50
                   grid grid-cols-[1fr_auto] gap-6
                   [box-shadow:inset_-2px_2px_0_rgba(255,255,255,1),_-20px_20px_40px_rgba(0,0,0,.25)]"
      >
        <h3 className="text-2xl font-medium uppercase tracking-wide self-end">
          Programming
        </h3>

        <div className="text-5xl leading-none">
          <i className="fa-solid fa-laptop-code bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent"></i>
        </div>

        <div className="col-span-2">
          <h4 className="text-lg font-semibold mb-2">Projetos por Instituição</h4>
          <div className="h-[300px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byInstitution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="institution" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-2 h-[2px] bg-gradient-to-r from-rose-500 to-indigo-500"></div>
      </div>

      {/* Card - Gráfico de Barras */}
      <div
        className="w-[50rem] p-10 rounded-3xl text-slate-600 bg-gradient-to-bl from-slate-200 to-slate-50
                   grid grid-cols-[1fr_auto] gap-6
                   [box-shadow:inset_-2px_2px_0_rgba(255,255,255,1),_-20px_20px_40px_rgba(0,0,0,.25)]"
      >
        <h3 className="text-2xl font-medium uppercase tracking-wide self-end">
          Programming
        </h3>

        <div className="text-5xl leading-none">
          <i className="fa-solid fa-laptop-code bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent"></i>
        </div>

        <div className="col-span-2">
          <h4 className="text-lg font-semibold mb-2">Projetos por Instituição</h4>
          <div className="h-[300px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byInstitution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="institution" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-2 h-[2px] bg-gradient-to-r from-rose-500 to-indigo-500"></div>
      </div>
            {/* Card - Gráfico de Barras */}
      <div
        className="w-[50rem] p-10 rounded-3xl text-slate-600 bg-gradient-to-bl from-slate-200 to-slate-50
                   grid grid-cols-[1fr_auto] gap-6
                   [box-shadow:inset_-2px_2px_0_rgba(255,255,255,1),_-20px_20px_40px_rgba(0,0,0,.25)]"
      >
        <h3 className="text-2xl font-medium uppercase tracking-wide self-end">
          Programming
        </h3>

        <div className="text-5xl leading-none">
          <i className="fa-solid fa-laptop-code bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent"></i>
        </div>

        <div className="col-span-2">
          <h4 className="text-lg font-semibold mb-2">Projetos por Instituição</h4>
          <div className="h-[300px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byInstitution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="institution" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-2 h-[2px] bg-gradient-to-r from-rose-500 to-indigo-500"></div>
      </div>
            {/* Card - Gráfico de Barras */}
      <div
        className="w-[50rem] p-10 rounded-3xl text-slate-600 bg-gradient-to-bl from-slate-200 to-slate-50
                   grid grid-cols-[1fr_auto] gap-6
                   [box-shadow:inset_-2px_2px_0_rgba(255,255,255,1),_-20px_20px_40px_rgba(0,0,0,.25)]"
      >
        <h3 className="text-2xl font-medium uppercase tracking-wide self-end">
          Programming
        </h3>

        <div className="text-5xl leading-none">
          <i className="fa-solid fa-laptop-code bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent"></i>
        </div>

        <div className="col-span-2">
          <h4 className="text-lg font-semibold mb-2">Projetos por Instituição</h4>
          <div className="h-[300px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byInstitution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="institution" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-2 h-[2px] bg-gradient-to-r from-rose-500 to-indigo-500"></div>
      </div>
    </div>
  );
}
