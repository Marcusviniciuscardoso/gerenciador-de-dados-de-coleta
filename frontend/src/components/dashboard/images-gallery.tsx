import React, { useEffect, useState } from "react";
import { obterUsuarioLogado } from "../../services/usuarioService";
import { getProjetosByUsuarioId } from "../../services/projetoService";
import { getColetaById } from "../../services/coletaService";
import { getAmostraById } from "../../services/amostraService";
import { getPresignedGetUrl } from "../../services/uploadService"; // 👈 mesmo service do AmostraDetalhes

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
  imageLink: string; // key do R2 ou URL completa
}

interface AmostraComUrl {
  amostra: Amostra;
  url: string | null;
}

export function ImagesGallery() {
  const [amostras, setAmostras] = useState<Amostra[]>([]);
  const [cards, setCards] = useState<AmostraComUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarAmostras = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Usuário logado
        const usuarioResponse = await obterUsuarioLogado();
        const usuarioData: Usuario = usuarioResponse.data;
        console.log("[ImagesGallery] Usuário logado:", usuarioData);

        // 2) Projetos do usuário
        const projetosResponse = await getProjetosByUsuarioId(
          usuarioData.idUsuarios
        );
        const projetosData: Projeto[] = Array.isArray(projetosResponse.data)
          ? projetosResponse.data
          : [];

        console.log("[ImagesGallery] projetosData:", projetosData);

        if (projetosData.length === 0) {
          console.warn("[ImagesGallery] Usuário não tem projetos.");
          setAmostras([]);
          setCards([]);
          return;
        }

        // 3) Coletas de TODOS os projetos
        const respostasColetas = await Promise.all(
          projetosData.map((proj) => getColetaById(proj.idProjetos))
        );

        const coletasData: Coleta[] = respostasColetas.flatMap((resp, idx) => {
          const raw = resp.data;
          const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
          console.log(
            `[ImagesGallery] Coletas do projeto ${projetosData[idx].idProjetos}:`,
            arr
          );
          return arr;
        });

        if (coletasData.length === 0) {
          console.warn("[ImagesGallery] Projetos não têm coletas.");
          setAmostras([]);
          setCards([]);
          return;
        }

        const coletasIds = coletasData.map((c) => c.idColetas);
        console.log("[ImagesGallery] IDs das coletas:", coletasIds);
        console.log("Olha os coletasIds: ", coletasIds)
        // 4) Amostras de TODAS as coletas
        const respostasAmostras = await Promise.all(
          coletasIds.map((coletaId) => getAmostraById(coletaId))
        );
        console.log("Chegou aqui");
        
        const amostrasFlatten: Amostra[] = respostasAmostras.flatMap((resp, idx) => {
          const raw = resp.data;
          const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
          console.log(
            `[ImagesGallery] Amostras da coleta ${coletasIds[idx]}:`,
            arr
          );
          return arr;
        });

        console.log("[ImagesGallery] Todas as amostras (flatten):", amostrasFlatten);
        setAmostras(amostrasFlatten);

        // 5) Resolver URLs de imagem (via R2)
        const amostrasComLink = amostrasFlatten.filter(
          (a) => !!a.imageLink && a.imageLink.trim() !== ""
        );

        console.log(
          "[ImagesGallery] Amostras com imageLink preenchido:",
          amostrasComLink
        );

        const cardsResolvidos: AmostraComUrl[] = await Promise.all(
          amostrasComLink.map(async (amostra) => {
            const keyOuUrl = amostra.imageLink;
            try {
              // já é URL completa?
              if (keyOuUrl.startsWith("http")) {
                console.log(
                  "[ImagesGallery] imageLink já é URL, usando direto:",
                  keyOuUrl
                );
                return { amostra, url: keyOuUrl };
              }

              console.log(
                "[ImagesGallery] imageLink é KEY do R2, chamando presign-get:",
                keyOuUrl
              );

              const resp = await getPresignedGetUrl(keyOuUrl);
              console.log(
                "[ImagesGallery] Resposta presign-get para",
                keyOuUrl,
                ":",
                resp.data
              );

              const url = resp.data?.url || resp.data?.downloadUrl || null;
              return { amostra, url };
            } catch (e) {
              console.error(
                "[ImagesGallery] Erro ao gerar presigned GET para",
                keyOuUrl,
                e
              );
              return { amostra, url: null };
            }
          })
        );

        setCards(cardsResolvidos);
      } catch (err: any) {
        console.error("[ImagesGallery] Erro na obtenção de informações:", err);
        setError(err?.message || "Erro ao carregar imagens.");
        setAmostras([]);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    carregarAmostras();
  }, []);

  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      {/* Título */}
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <span className="text-2xl">📸</span>
        Imagens de Amostras
      </h3>

      {loading && <p>Carregando imagens...</p>}

      {error && (
        <p className="text-sm text-red-600 mb-4">
          {error}
        </p>
      )}

      {!loading && cards.length === 0 && (
        <p className="text-sm text-gray-500">
          Nenhuma amostra com imagem vinculada foi encontrada.
        </p>
      )}

      {/* Grid de imagens dinâmicas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ amostra, url }) => (
          <div
            key={amostra.idAmostras}
            className="rounded-lg overflow-hidden border bg-white shadow-sm"
          >
            {url ? (
              <img
                src={url}
                alt={amostra.descricao || amostra.codigo}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  console.error(
                    "[ImagesGallery] Falha ao carregar imagem no browser:",
                    e
                  );
                }}
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                Imagem indisponível
              </div>
            )}

            <div className="p-4">
              <span className="inline-block text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700 font-medium">
                Amostra
              </span>
              <h4 className="mt-2 font-semibold text-gray-900">
                {amostra.codigo || "Sem código"}
              </h4>
              <p className="text-sm text-gray-500 line-clamp-2">
                {amostra.descricao || "Sem descrição"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Coleta ID: {amostra.coletaId}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
