export default function UserManagement() {
  return (
    <div className="p-8">
      {/* Título */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Usuários</h1>
          <p className="text-gray-500 text-sm">
            Administre contas de usuário e permissões
          </p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          + Novo Usuário
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
          <h3 className="text-2xl font-bold text-gray-800">5</h3>
          <p className="text-sm text-gray-600">Total de Usuários</p>
          <span className="text-xs text-gray-400">Usuários cadastrados</span>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
          <h3 className="text-2xl font-bold text-gray-800">4</h3>
          <p className="text-sm text-gray-600">Usuários Ativos</p>
          <span className="text-xs text-gray-400">Usuários com acesso ativo</span>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
          <h3 className="text-2xl font-bold text-gray-800">11</h3>
          <p className="text-sm text-gray-600">Projetos Criados</p>
          <span className="text-xs text-gray-400">
            Total de projetos dos usuários
          </span>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
          <h3 className="text-2xl font-bold text-gray-800">53</h3>
          <p className="text-sm text-gray-600">Coletas Realizadas</p>
          <span className="text-xs text-gray-400">
            Total de coletas dos usuários
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por nome, email..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todos os Status</option>
            <option>Ativos</option>
            <option>Inativos</option>
          </select>
          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todas as Funções</option>
            <option>Administrador</option>
            <option>Pesquisador</option>
            <option>Colaborador</option>
          </select>
        </div>
      </div>
    </div>
  );
}
