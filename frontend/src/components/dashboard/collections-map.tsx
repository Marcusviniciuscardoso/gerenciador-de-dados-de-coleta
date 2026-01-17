import React, { useEffect, useMemo, useState } from "react";
import { getProjetosByUsuarioId } from "../../services/projetoService";
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

export interface Projeto {
  idProjetos: number;
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

export interface Coleta {
  idColetas: number;
  projetoId: number;
  local: string;
  latitude: number;
  longitude: number;
  dataColeta: number;
  hora_inicio: number;
  hora_fim: number;
  observacoes: string;
  coletado_por: number;
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

type ColetaComAmostras = Coleta & { amostras: Amostra[] };
type ProjetoComTudo = Projeto & {
  coletas: ColetaComAmostras[];
  totalAmostras: number;
};

export function CollectionsMap() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [coletas, setColetas] = useState<Coleta[]>([]);
  const [amostras, setAmostras] = useState<Amostra[]>([]);

  // Seleção (pra você filtrar a tela por um projeto)
  const [projetoSelecionadoId, setProjetoSelecionadoId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const carregarTudo = async () => {
      try {
        // 1) Usuário
        const usuarioResponse = await obterUsuarioLogado();
        const usuarioData: Usuario = usuarioResponse.data;
        setUsuario(usuarioData);

        // 2) Projetos
        const projetosResponse = await getProjetosByUsuarioId(usuarioData.idUsuarios);
        const projetosData: Projeto[] = Array.isArray(projetosResponse.data)
          ? projetosResponse.data
          : [];

        setProjetos(projetosData);

        if (projetosData.length === 0) {
          setProjetoSelecionadoId(null);
          setColetas([]);
          setAmostras([]);
          return;
        }

        // seleciona o primeiro por padrão
        setProjetoSelecionadoId(projetosData[0].idProjetos);

        // 3) Coletas de TODOS os projetos (em paralelo)
        const respostasColetas = await Promise.all(
          projetosData.map((p) => getColetaById(p.idProjetos))
        );

        const coletasFlatten: Coleta[] = respostasColetas.flatMap((resp) =>
          Array.isArray(resp.data) ? resp.data : []
        );

        setColetas(coletasFlatten);

        if (coletasFlatten.length === 0) {
          setAmostras([]);
          return;
        }

        // 4) Amostras de TODAS as coletas (em paralelo)
        const coletaIds = coletasFlatten.map((c) => c.idColetas);

        const respostasAmostras = await Promise.all(
          coletaIds.map((id) => getAmostraById(id))
        );

        const amostrasFlatten: Amostra[] = respostasAmostras.flatMap((resp) => {
          const data = resp.data;
          if (Array.isArray(data)) return data;
          if (data) return [data];
          return [];
        });

        setAmostras(amostrasFlatten);
      } catch (error) {
        console.error("Erro no carregamento:", error);
      }
    };

    carregarTudo();
  }, []);

  // ✅ 1) Índice: coletas agrupadas por projetoId
  const coletasPorProjeto = useMemo(() => {
    const map = new Map<number, Coleta[]>();
    for (const c of coletas) {
      const arr = map.get(c.projetoId) ?? [];
      arr.push(c);
      map.set(c.projetoId, arr);
    }
    return map;
  }, [coletas]);

  // ✅ 2) Índice: amostras agrupadas por coletaId
  const amostrasPorColeta = useMemo(() => {
    const map = new Map<number, Amostra[]>();
    for (const a of amostras) {
      const arr = map.get(a.coletaId) ?? [];
      arr.push(a);
      map.set(a.coletaId, arr);
    }
    return map;
  }, [amostras]);

  // ✅ 3) “Join”: Projeto -> Coletas -> Amostras
  const projetosComTudo = useMemo<ProjetoComTudo[]>(() => {
    return projetos.map((p) => {
      const coletasDoProjeto = coletasPorProjeto.get(p.idProjetos) ?? [];

      const coletasComAmostras: ColetaComAmostras[] = coletasDoProjeto.map((c) => ({
        ...c,
        amostras: amostrasPorColeta.get(c.idColetas) ?? [],
      }));

      const totalAmostras = coletasComAmostras.reduce(
        (acc, c) => acc + c.amostras.length,
        0
      );

      return {
        ...p,
        coletas: coletasComAmostras,
        totalAmostras,
      };
    });
  }, [projetos, coletasPorProjeto, amostrasPorColeta]);

  const projetoSelecionado = useMemo(() => {
    if (projetoSelecionadoId == null) return null;
    return projetosComTudo.find((p) => p.idProjetos === projetoSelecionadoId) ?? null;
  }, [projetosComTudo, projetoSelecionadoId]);

  const coletasVisiveis = projetoSelecionado?.coletas ?? [];

  return (
    <div>
      <div className="rounded-lg border bg-white shadow-sm p-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <span className="text-2xl">📖</span>
          Pontos de Coleta na Amazônia
        </h3>

        {/* Seletor de projeto (opcional, mas muito útil) */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm text-gray-600">Projeto:</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={projetoSelecionadoId ?? ""}
            onChange={(e) => setProjetoSelecionadoId(Number(e.target.value))}
          >
            {projetosComTudo.map((p) => (
              <option key={p.idProjetos} value={p.idProjetos}>
                {p.nome} ({p.coletas.length} coletas / {p.totalAmostras} amostras)
              </option>
            ))}
          </select>
        </div>

        {/* Placeholder do mapa */}
        <div className="relative h-64 rounded-lg bg-gradient-to-b from-green-100 to-blue-100 flex items-center justify-center">
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm">
            <p className="text-gray-700">
              Usuário: <b>{usuario?.nome ?? "carregando..."}</b>
            </p>
            <p className="text-gray-700">
              Coletas no projeto: <b>{coletasVisiveis.length}</b>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm p-6 w-[22rem] mt-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <span className="text-red-500 text-2xl">📍</span>
          Principais Locais de Coleta
        </h3>

        <div className="space-y-4">
          {coletasVisiveis.map((coleta) => {
            const codigos = coleta.amostras.slice(0, 2).map((a) => a.codigo);
            const extra = coleta.amostras.length - codigos.length;

            return (
              <div
                key={coleta.idColetas}
                className="rounded-lg border bg-gray-50 p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900">{coleta.local}</h4>
                  <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">
                    {coleta.amostras.length} amostras
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  <span className="mr-1">📍</span>
                  {coleta.latitude}, {coleta.longitude}
                </p>

                <p className="text-sm font-medium text-gray-800 mb-1">
                  Exemplos de amostras:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {codigos.map((c) => (
                    <li key={c} className="italic">
                      {c}
                    </li>
                  ))}
                  {extra > 0 && <li className="text-gray-500">+{extra} outras</li>}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
