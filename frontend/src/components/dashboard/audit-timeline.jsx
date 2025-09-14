export function AuditTimeline() {
   const users = [
    { id: 1, name: "Dr. Maria Silva", actions: 234, percentage: "33.3%" },
    { id: 2, name: "Prof. João Santos", actions: 189, percentage: "26.9%" },
    { id: 3, name: "Dra. Ana Costa", actions: 156, percentage: "22.2%" },
    { id: 4, name: "Dr. Carlos Lima", actions: 123, percentage: "17.5%" },
  ];
  return (
    <div>
       <div className="rounded-lg border bg-white shadow-sm p-6">
      {/* Título */}
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <span className="text-2xl">🕒</span>
        Log de Auditoria Recente
      </h3>

      <div className="space-y-4">
        {/* Log 1 */}
        <div className="rounded-lg border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-green-600 text-xl">⏱️</span>
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              CREATE
            </span>
            <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
              LOW
            </span>
          </div>
          <p className="font-semibold text-gray-800">Amostra AM-2024-0234</p>
          <p className="text-sm text-gray-600">Nova amostra de tecido foliar criada</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>👩‍🔬 Dr. Maria Silva</span>
            <span>📅 10/01/2024, 12:30</span>
          </div>
        </div>

        {/* Log 2 */}
        <div className="rounded-lg border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-orange-600 text-xl">📄</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
              UPDATE
            </span>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">
              MEDIUM
            </span>
          </div>
          <p className="font-semibold text-gray-800">Projeto Flora Amazônica</p>
          <p className="text-sm text-gray-600">Status do projeto alterado para 'Em andamento'</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>👨‍🏫 Prof. João Santos</span>
            <span>📅 10/01/2024, 11:15</span>
          </div>
        </div>

        {/* Log 3 */}
        <div className="rounded-lg border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-red-600 text-xl">⚠️</span>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
              DELETE
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
              HIGH
            </span>
          </div>
          <p className="font-semibold text-gray-800">Usuário teste@example.com</p>
          <p className="text-sm text-gray-600">Conta de usuário removida</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>👤 Sistema</span>
            <span>📅 10/01/2024, 10:45</span>
          </div>
        </div>
      </div>
    </div>
    <div className="rounded-lg border bg-white shadow-sm p-6">
      {/* Título */}
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <i className="fa-solid fa-users text-gray-700"></i>
        Usuários Mais Ativos
      </h3>

      {/* Grid de usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center rounded-lg bg-gray-50 px-4 py-3"
          >
            <span className="flex items-center gap-3 font-medium text-gray-700">
              {/* Número de ranking */}
              <span className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                {user.id}
              </span>
              <div className="flex flex-col">
                <span className="font-semibold">{user.name}</span>
                <span className="text-sm text-gray-500">
                  {user.actions} ações realizadas
                </span>
              </div>
            </span>

            {/* Percentual */}
            <span className="px-3 py-1 text-sm rounded-full border border-gray-300 text-gray-700 font-medium">
              {user.percentage}
            </span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
