import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Folder, Trash, Pencil } from "lucide-react";
import { getProjetosByUsuarioId, deletarProjeto } from "../services/projetoService";
import { obterUsuarioLogado } from "../services/usuarioService";
import { getPresignedGetUrl } from "../services/uploadService";

function ProjetoPageMock() {
  const [projetos, setProjetos] = useState([]);
  const [testImageUrl, setTestImageUrl] = useState(null);
  const navigate = useNavigate();

  // 🔥 coloque aqui a key REAL que está no seu R2
  const TEST_IMAGE_KEY = "amostras/12/b4807f54-c4a4-47cb-8080-955d050aebd9.jpg";

  useEffect(() => {
    const carregar = async () => {
      try {
        const usuarioResponse = await obterUsuarioLogado();
        const u = usuarioResponse.data;

        const projetoResponse = await getProjetosByUsuarioId(u.idUsuarios);
        setProjetos(projetoResponse.data || []);

        // ✅ gera 1 presigned GET só pra testar se está retornando
        const resp = await getPresignedGetUrl(TEST_IMAGE_KEY);
        setTestImageUrl(resp.data.url);
      } catch (error) {
        console.error("Erro na obtenção:", error);
      }
    };

    carregar();
  }, []);

  const excluirProjeto = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        await deletarProjeto(id);
        setProjetos((prev) => prev.filter((p) => p.idProjetos !== id));
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
        alert("Ocorreu um erro ao tentar excluir o projeto.");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projetos.map((projeto) => (
          <div key={projeto.idProjetos} className="border rounded-lg p-4">
            {/* ✅ imagem global só pra teste */}
            <div className="mb-3">
              {testImageUrl ? (
                <img
                  src={testImageUrl}
                  alt="Imagem de teste (R2)"
                  className="w-full h-40 object-cover rounded-md"
                  loading="lazy"
                  onError={(e) => {
                    console.error("Falha ao carregar imagem do R2");
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-40 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Carregando imagem...
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                {projeto.nome?.length > 25 ? projeto.nome.slice(0, 25) + "..." : projeto.nome}
              </h2>
              <Folder className="w-5 h-5 text-gray-500" />
            </div>

            <p className="text-gray-600 mb-3">{projeto.descricao}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate(`/projetos/${projeto.idProjetos}`)}
                className="flex-1 border rounded px-3 py-1 hover:bg-gray-100"
              >
                Ver Detalhes
              </button>
              <button
                onClick={() => navigate(`/projetos/editar/${projeto.idProjetos}`)}
                className="p-2 border rounded hover:bg-gray-100"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => excluirProjeto(projeto.idProjetos)}
                className="p-2 border rounded hover:bg-red-100"
              >
                <Trash className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjetoPageMock;
