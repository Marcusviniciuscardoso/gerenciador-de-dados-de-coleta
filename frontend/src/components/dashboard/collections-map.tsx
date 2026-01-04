import React, { useEffect, useState } from "react";
import { getColetaById } from "../../services/coletaService";
import { getAmostraById } from "../../services/amostraService";
import { obterUsuarioLogado } from "../../services/usuarioService";

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

export function CollectionsMap() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const locais = [
    {
      nome: "Reserva Ducke",
      coordenadas: "-2.9547, -59.9733",
      amostras: 145,
      especies: ["Cecropia palmata", "Inga edulis"],
      extras: "+1 outras espécies",
    },
    {
      nome: "PDBFF - Km 41",
      coordenadas: "-2.4092, -59.7853",
      amostras: 98,
      especies: ["Swietenia macrophylla", "Carapa guianensis"],
    },
    {
      nome: "Floresta Nacional de Tapajós",
      coordenadas: "-2.8547, -54.9587",
      amostras: 76,
      especies: ["Dipteryx odorata", "Hymenaea courbaril"],
    },
  ];

  useEffect(() => {
    console.log("Oi")
    const carregarColetas = async () =>{
      try{
        console.log("Chegou qui")
        const usuarioResponse = await obterUsuarioLogado();
        setUsuario(usuarioResponse.data);

        const ColetaResponse = await getColetaById(
              usuarioResponse.data.idUsuarios
        );
        console.log("Resposta do coletaResponse: ", ColetaResponse)

        const amostraResponse = await getAmostraById(
              ColetaResponse.data.idColetas
        );
      }catch(error){
        console.error("Erro na obtenção das coletas: ", error);
      }
    }
    carregarColetas();
  }, []);

  return (
    <div>
      <div className="rounded-lg border bg-white shadow-sm p-6">
      {/* Título */}
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <span className="text-2xl">📖</span>
        Pontos de Coleta na Amazônia
      </h3>

      {/* Área do gráfico/mapa (placeholder estilizado) */}
      <div className="relative h-64 rounded-lg bg-gradient-to-b from-green-100 to-blue-100 flex items-center justify-center">
        {/* Pontos vermelhos de coleta */}
        <div className="absolute top-12 left-32 w-3 h-3 bg-red-400 rounded-full"></div>
        <div className="absolute top-32 left-60 w-3 h-3 bg-red-400 rounded-full"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-red-400 rounded-full"></div>

        {/* Linhas ilustrativas */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 150 C100 50, 200 250, 400 100"
            stroke="#6ee7b7"
            strokeWidth="2"
            fill="transparent"
          />
          <path
            d="M0 180 C120 80, 220 220, 400 140"
            stroke="#93c5fd"
            strokeWidth="2"
            fill="transparent"
          />
        </svg>

        {/* Legenda */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm">
          <p className="flex items-center gap-2 text-gray-700">
            <span className="w-3 h-3 bg-red-400 rounded-full"></span>
            Pontos de Coleta (3)
          </p>
        </div>
      </div>
    </div>
    <div className="rounded-lg border bg-white shadow-sm p-6 w-[22rem]">
      {/* Título */}
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <span className="text-red-500 text-2xl">📍</span>
        Principais Locais de Coleta
      </h3>

      {/* Lista de locais */}
      <div className="space-y-4">
        {locais.map((local, index) => (
          <div
            key={index}
            className="rounded-lg border bg-gray-50 p-4 hover:shadow-md transition"
          >
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900">{local.nome}</h4>
              <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">
                {local.amostras} amostras
              </span>
            </div>

            {/* Coordenadas */}
            <p className="text-sm text-gray-500 mb-3">
              <span className="mr-1">📍</span>
              {local.coordenadas}
            </p>

            {/* Espécies */}
            <p className="text-sm font-medium text-gray-800 mb-1">
              Espécies coletadas:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {local.especies.map((e, i) => (
                <li key={i} className="italic">
                  {e}
                </li>
              ))}
              {local.extras && (
                <li className="text-gray-500">{local.extras}</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
