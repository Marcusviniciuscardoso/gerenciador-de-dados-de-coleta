import React, { useEffect, useState } from "react";
import { obterUsuarioLogado } from "../../services/usuarioService";
import { getProjetosByUsuarioId } from "../../services/projetoService";
import { getColetaById } from "../../services/coletaService";
import { getAmostraById } from "../../services/amostraService";
import { getPresignedGetUrl } from "../../services/uploadService";

// ── Interfaces ────────────────────────────────────────────────────────────────
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

interface AmostraComUrl {
  amostra: Amostra;
  url: string | null;
}

// ── Componente ────────────────────────────────────────────────────────────────
export function ImagesGallery() {
  const [amostras, setAmostras] = useState<Amostra[]>([]);
  const [cards, setCards]       = useState<AmostraComUrl[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const carregarAmostras = async () => {
      try {
        setLoading(true);
        setError(null);

        const usuarioResponse = await obterUsuarioLogado();
        const usuarioData: Usuario = usuarioResponse.data;
        console.log("[ImagesGallery] Usuário logado:", usuarioData);

        const projetosResponse = await getProjetosByUsuarioId(usuarioData.idUsuarios);
        const projetosData: Projeto[] = Array.isArray(projetosResponse.data)
          ? projetosResponse.data : [];
        console.log("[ImagesGallery] projetosData:", projetosData);

        if (projetosData.length === 0) {
          console.warn("[ImagesGallery] Usuário não tem projetos.");
          setAmostras([]); setCards([]); return;
        }

        const respostasColetas = await Promise.all(
          projetosData.map((proj) => getColetaById(proj.idProjetos))
        );
        const coletasData: Coleta[] = respostasColetas.flatMap((resp, idx) => {
          const raw = resp.data;
          const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
          console.log(`[ImagesGallery] Coletas do projeto ${projetosData[idx].idProjetos}:`, arr);
          return arr;
        });

        if (coletasData.length === 0) {
          console.warn("[ImagesGallery] Projetos não têm coletas.");
          setAmostras([]); setCards([]); return;
        }

        const coletasIds = coletasData.map((c) => c.idColetas);
        console.log("[ImagesGallery] IDs das coletas:", coletasIds);

        const respostasAmostras = await Promise.all(
          coletasIds.map((coletaId) => getAmostraById(coletaId))
        );
        console.log("Chegou aqui");

        const amostrasFlatten: Amostra[] = respostasAmostras.flatMap((resp, idx) => {
          const raw = resp.data;
          const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
          console.log(`[ImagesGallery] Amostras da coleta ${coletasIds[idx]}:`, arr);
          return arr;
        });

        console.log("[ImagesGallery] Todas as amostras (flatten):", amostrasFlatten);
        setAmostras(amostrasFlatten);

        const amostrasComLink = amostrasFlatten.filter(
          (a) => !!a.imageLink && a.imageLink.trim() !== ""
        );
        console.log("[ImagesGallery] Amostras com imageLink preenchido:", amostrasComLink);

        const cardsResolvidos: AmostraComUrl[] = await Promise.all(
          amostrasComLink.map(async (amostra) => {
            const keyOuUrl = amostra.imageLink;
            try {
              if (keyOuUrl.startsWith("http")) {
                console.log("[ImagesGallery] imageLink já é URL, usando direto:", keyOuUrl);
                return { amostra, url: keyOuUrl };
              }
              console.log("[ImagesGallery] imageLink é KEY do R2, chamando presign-get:", keyOuUrl);
              const resp = await getPresignedGetUrl(keyOuUrl);
              console.log("[ImagesGallery] Resposta presign-get para", keyOuUrl, ":", resp.data);
              const url = resp.data?.url || resp.data?.downloadUrl || null;
              return { amostra, url };
            } catch (e) {
              console.error("[ImagesGallery] Erro ao gerar presigned GET para", keyOuUrl, e);
              return { amostra, url: null };
            }
          })
        );

        setCards(cardsResolvidos);
      } catch (err: any) {
        console.error("[ImagesGallery] Erro na obtenção de informações:", err);
        setError(err?.message || "Erro ao carregar imagens.");
        setAmostras([]); setCards([]);
      } finally {
        setLoading(false);
      }
    };
    carregarAmostras();
  }, []);

  return (
    <div className="card-notebook">
      {/* cabeçalho */}
      <div className="mb-6">
        <div className="font-script text-sage-600 text-sm italic leading-none mb-1">herbário digital</div>
        <h3 className="heading-serif text-xl text-olive-dark">Imagens de Amostras</h3>
        <div className="mt-2 h-px bg-gradient-to-r from-tan to-transparent" />
      </div>

      {/* estados */}
      {loading && (
        <p className="font-script text-sage-600 text-base animate-pulse">
          Carregando imagens…
        </p>
      )}

      {error && (
        <div className="bg-rust/10 border border-rust/40 text-rust text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      {!loading && cards.length === 0 && (
        <p className="font-script text-sage-600 text-base">
          Nenhuma amostra com imagem vinculada foi encontrada.
        </p>
      )}

      {/* Grid de imagens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ amostra, url }) => (
          <div
            key={amostra.idAmostras}
            className="bg-paper-light border border-tan/60 rounded-lg overflow-hidden shadow-card hover:shadow-notebook transition"
          >
            {/* imagem */}
            {url ? (
              <img
                src={url}
                alt={amostra.descricao || amostra.codigo}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  console.error("[ImagesGallery] Falha ao carregar imagem no browser:", e);
                }}
              />
            ) : (
              <div className="w-full h-40 bg-sage-100 flex items-center justify-center">
                <span className="font-script text-sage-600/60 text-sm">imagem indisponível</span>
              </div>
            )}

            {/* dados */}
            <div className="p-4">
              {/* badge tipo etiqueta */}
              <span className="inline-block text-[10px] tracking-widest font-semibold uppercase border border-tan bg-paper text-olive rounded-full px-2.5 py-0.5">
                {amostra.tipoAmostra || 'amostra'}
              </span>

              <h4 className="mt-2 font-medium text-olive-dark text-sm">
                {amostra.codigo || "Sem código"}
              </h4>

              <p className="font-script text-sage-600 text-sm italic line-clamp-2 mt-0.5">
                {amostra.identificacao_final || amostra.descricao || "—"}
              </p>

              <p className="text-[10px] tracking-wider text-olive-light/60 mt-2 border-t border-dashed border-tan pt-2">
                Coleta #{amostra.coletaId}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
