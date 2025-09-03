// pages/AdminDashboard.jsx
/*import React, { useEffect, useState } from 'react';
import { Users, Folder, FlaskConical, HardDrive, Shield, Settings, LineChart, Database, FileCog } from 'lucide-react';
//import { getAdminMetrics } from '../services/adminService';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAdminMetrics();
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  //if (loading) return <div className="p-8">Carregando...</div>;
  //if (!data) return <div className="p-8">Não foi possível carregar o dashboard.</div>;

  const { cards, atividades } = data;

  const Card = ({ icon: Icon, title, value, subtitle }) => (
    <div className="rounded-xl border p-5 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <Icon className="w-5 h-5 text-gray-500" />
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {subtitle && <div className="text-gray-500 text-sm mt-1">{subtitle}</div>}
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-gray-600">Gerencie usuários, configurações e monitore o sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={Users}  title="Total de Usuários" value={cards.usuarios.total} subtitle={`${cards.usuarios.ativos ?? 0} ativos`} />
        <Card icon={Folder} title="Projetos Ativos"   value={cards.projetos.ativos} subtitle={`${cards.projetos.total} no sistema`} />
        <Card icon={FlaskConical} title="Coletas Realizadas" value={cards.coletas.total} subtitle="Total de coletas" />
        <Card icon={HardDrive} title="Armazenamento" value={cards.armazenamento.usedGB ? `${cards.armazenamento.usedGB} GB` : '—'} subtitle="Espaço utilizado" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Gerenciar Usuários</h3>
              <p className="text-gray-500 text-sm">Visualize, edite e gerencie contas</p>
            </div>
            <Users className="w-5 h-5 text-gray-500" />
          </div>
          <button onClick={() => (window.location.href = '/usuarios')}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            Ver Usuários
          </button>
        </div>

        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Permissões e Roles</h3>
              <p className="text-gray-500 text-sm">Configure níveis de acesso</p>
            </div>
            <Shield className="w-5 h-5 text-gray-500" />
          </div>
          <button onClick={() => (window.location.href = '/permissoes')}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            Gerenciar Permissões
          </button>
        </div>

        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Relatórios</h3>
              <p className="text-gray-500 text-sm">Estatísticas e relatórios</p>
            </div>
            <LineChart className="w-5 h-5 text-gray-500" />
          </div>
          <button onClick={() => (window.location.href = '/relatorios')}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            Ver Relatórios
          </button>
        </div>

        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Configurações do Sistema</h3>
              <p className="text-gray-500 text-sm">Parâmetros globais</p>
            </div>
            <Settings className="w-5 h-5 text-gray-500" />
          </div>
          <button onClick={() => (window.location.href = '/configuracoes')}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            Configurações
          </button>
        </div>

        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Backup e Dados</h3>
              <p className="text-gray-500 text-sm">Gerencie backups e exportação</p>
            </div>
            <Database className="w-5 h-5 text-gray-500" />
          </div>
          <button onClick={() => (window.location.href = '/dados')}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            Gerenciar Dados
          </button>
        </div>

        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Monitoramento</h3>
              <p className="text-gray-500 text-sm">Logs e performance</p>
            </div>
            <FileCog className="w-5 h-5 text-gray-500" />
          </div>
          <button onClick={() => (window.location.href = '/logs')}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            Ver Logs
          </button>
        </div>
      </div>

      <div className="rounded-xl border p-5 bg-white">
        <h3 className="text-lg font-semibold mb-3">Atividade Recente</h3>
        <ul className="space-y-2">
          {atividades.map(item => (
            <li key={item.id} className="flex items-center gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium">{item.acao}</span>
              <span className="text-gray-500">• {item.usuario}</span>
              <span className="text-gray-400">
                 {new Date(item.dataHora).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}*/

// pages/AdminDashboardMock.jsx
import React, { useEffect, useState } from 'react';
import { Users, Folder, FlaskConical, HardDrive, Shield, Settings, LineChart, Database, FileCog } from 'lucide-react';

const dataMock = {
  cards: {
    usuarios: { total: 5, ativos: 4 },
    projetos: { total: 3, ativos: 3 },
    coletas:  { total: 45 },
    armazenamento: { usedGB: 2.4 }
  },
  atividades: [
    { id: 1, acao: 'Novo usuário cadastrado', usuario: 'Ana Costa',     dataHora: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }, // 2h atrás
    { id: 2, acao: 'Projeto criado',          usuario: 'Dra. Maria Silva', dataHora: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() }, // 5h atrás
    { id: 3, acao: 'Backup realizado',        usuario: 'Sistema',        dataHora: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }  // 1 dia atrás
  ]
};

export default function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simula chamada à API
  useEffect(() => {
    const t = setTimeout(() => {
      setData(dataMock);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <div className="p-8">Carregando...</div>;
  if (!data)   return <div className="p-8">Não foi possível carregar o dashboard.</div>;

  const { cards, atividades } = data;

  const formatGB = (gb) =>
    typeof gb === 'number'
      ? `${gb.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} GB`
      : '—';

  const Card = ({ icon: Icon, title, value, subtitle }) => (
    <div className="rounded-xl border p-5 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <Icon className="w-5 h-5 text-gray-500" />
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {subtitle && <div className="text-gray-500 text-sm mt-1">{subtitle}</div>}
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-gray-600">Gerencie usuários, configurações e monitore o sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={Users}  title="Total de Usuários"     value={cards.usuarios.total}  subtitle={`${cards.usuarios.ativos ?? 0} ativos`} />
        <Card icon={Folder} title="Projetos Ativos"       value={cards.projetos.ativos} subtitle={`${cards.projetos.total} no sistema`} />
        <Card icon={FlaskConical} title="Coletas Realizadas" value={cards.coletas.total} subtitle="Total de coletas" />
        <Card icon={HardDrive} title="Armazenamento"      value={formatGB(cards.armazenamento.usedGB)} subtitle="Espaço utilizado" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Gerenciar Usuários</h3>
              <p className="text-gray-500 text-sm">Visualize, edite e gerencie contas</p>
            </div>
            <Users className="w-5 h-5 text-gray-500" />
          </div>
          <button onClick={() => (window.location.href = '/usuarios')}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            Ver Usuários
          </button>
        </div>

        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Permissões e Roles</h3>
              <p className="text-gray-500 text-sm">Configure níveis de acesso</p>
            </div>
            <Shield className="w-5 h-5 text-gray-500" />
          </div>
          <button onClick={() => (window.location.href = '/permissoes')}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            Gerenciar Permissões
          </button>
        </div>

        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Relatórios</h3>
              <p className="text-gray-500 text-sm">Estatísticas e relatórios</p>
            </div>
            <LineChart className="w-5 h-5 text-gray-500" />
          </div>
          <button onClick={() => (window.location.href = '/relatorios')}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            Ver Relatórios
          </button>
        </div>

        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Configurações do Sistema</h3>
              <p className="text-gray-500 text-sm">Parâmetros globais</p>
            </div>
            <Settings className="w-5 h-5 text-gray-500" />
          </div>
          <button onClick={() => (window.location.href = '/configuracoes')}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            Configurações
          </button>
        </div>

        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Backup e Dados</h3>
              <p className="text-gray-500 text-sm">Gerencie backups e exportação</p>
            </div>
            <Database className="w-5 h-5 text-gray-500" />
          </div>
          <button onClick={() => (window.location.href = '/dados')}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            Gerenciar Dados
          </button>
        </div>

        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Monitoramento</h3>
              <p className="text-gray-500 text-sm">Logs e performance</p>
            </div>
            <FileCog className="w-5 h-5 text-gray-500" />
          </div>
          <button onClick={() => (window.location.href = '/logs')}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            Ver Logs
          </button>
        </div>
      </div>

      <div className="rounded-xl border p-5 bg-white">
        <h3 className="text-lg font-semibold mb-3">Atividade Recente</h3>
        <ul className="space-y-2">
          {atividades.map(item => (
            <li key={item.id} className="flex items-center gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium">{item.acao}</span>
              <span className="text-gray-500">• {item.usuario}</span>
              <span className="text-gray-400">
                • {new Date(item.dataHora).toLocaleString('pt-BR')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
