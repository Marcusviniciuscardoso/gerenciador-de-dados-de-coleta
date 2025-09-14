export function ImagesGallery() {
  return (
    <div>
     <div className="rounded-lg border bg-white shadow-sm p-6">
      {/* Título */}
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <span className="text-2xl">📸</span>
        Imagens Recentes
      </h3>

      {/* Grid de imagens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="rounded-lg overflow-hidden border bg-white shadow-sm">
          <img
            src="https://placehold.co/600x400/forest"
            alt="Coleta na Reserva Ducke"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <span className="inline-block text-xs px-2 py-1 rounded-md bg-green-100 text-green-700 font-medium">
              Coleta
            </span>
            <h4 className="mt-2 font-semibold text-gray-900">
              Coleta na Reserva Ducke
            </h4>
            <p className="text-sm text-gray-500">Por: Dr. Maria Silva</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <i className="fa-regular fa-calendar"></i>
              10/01, 11:30
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-lg overflow-hidden border bg-white shadow-sm">
          <img
            src="https://placehold.co/600x400/plant"
            alt="Amostra de Cecropia palmata"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <span className="inline-block text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700 font-medium">
              Amostra
            </span>
            <h4 className="mt-2 font-semibold text-gray-900">
              Amostra de Cecropia palmata
            </h4>
            <p className="text-sm text-gray-500">Por: Prof. João Santos</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <i className="fa-regular fa-calendar"></i>
              10/01, 08:15
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-lg overflow-hidden border bg-white shadow-sm">
          <img
            src="https://placehold.co/600x400/team"
            alt="Projeto Flora Amazônica"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <span className="inline-block text-xs px-2 py-1 rounded-md bg-purple-100 text-purple-700 font-medium">
              Projeto
            </span>
            <h4 className="mt-2 font-semibold text-gray-900">
              Projeto Flora Amazônica
            </h4>
            <p className="text-sm text-gray-500">Por: Dra. Ana Costa</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <i className="fa-regular fa-calendar"></i>
              09/01, 13:45
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-lg overflow-hidden border bg-white shadow-sm">
          <img
            src="https://placehold.co/600x400/microscope"
            alt="Equipamento de análise"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <span className="inline-block text-xs px-2 py-1 rounded-md bg-orange-100 text-orange-700 font-medium">
              Equipamento
            </span>
            <h4 className="mt-2 font-semibold text-gray-900">
              Equipamento de análise
            </h4>
            <p className="text-sm text-gray-500">Por: Dr. Carlos Lima</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <i className="fa-regular fa-calendar"></i>
              09/01, 06:20
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
