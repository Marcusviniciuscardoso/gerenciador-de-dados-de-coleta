import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { criarAmostra, atualizarAmostra } from "../services/amostraService";
import { presignUpload } from "../services/uploadService";

function NovaAmostra() {
  const { projetoId, coletaId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    descricao: "",
    codigo: "",
    tipoAmostra: "",
    recipiente: "",
    metodoPreservacao: "",
    quantidade: "",
    validade: "",
    identificacao_final: "",
    observacoes: "",
    imagens: [],      // <== Files selecionados no upload (só no frontend)
    imageLink: "",    // <== campo que vai pro banco (key do R2)
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedKeys, setUploadedKeys] = useState([]);

  const handleImagem = (e) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({ ...prev, imagens: files }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Faz o upload das imagens usando o formato da função presignUpload
  const uploadImagens = async (amostraId) => {
    if (!form.imagens.length) return [];

    setUploading(true);
    setUploadError("");
    const keys = [];

    try {
      for (const file of form.imagens) {
        // 1) pede a URL assinada
        const { data } = await presignUpload({
          filename: file.name,
          contentType: file.type,
          amostraId, // segue o formato { filename, contentType, amostraId }
        });
        console.log("O retorno de data: ", data);

        const { uploadUrl, key } = data;

        // 2) faz o upload direto pro R2/S3
        const resp = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!resp.ok) {
          throw new Error(`Falha no PUT do arquivo ${file.name}: ${resp.status}`);
        }

        keys.push(key);
      }

      setUploadedKeys(keys);
      return keys;
    } catch (err) {
      console.error("Erro no upload das imagens:", err);
      setUploadError("Erro ao enviar as imagens.");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const salvarAmostra = async () => {
    try {
      // 1) cria a amostra sem mandar os Files nem o imageLink
      const payload = {
        ...form,
        imagens: undefined,   // não vai no JSON
        imageLink: undefined, // vamos preencher depois com a key real
        coletaId,
      };

      const response = await criarAmostra(payload);

      const amostraCriada = response.data || response;
      console.log("Olha a amostra criada: ", amostraCriada);

      const amostraId = amostraCriada.idAmostras || amostraCriada.id;
      if (!amostraId) {
        console.warn("ID da amostra não encontrado na resposta:", amostraCriada);
      }

      // 2) se tiver imagens, faz upload e salva a key da principal em imageLink
      if (amostraId && form.imagens.length) {
        const keys = await uploadImagens(amostraId);

        if (keys.length > 0) {
          const principalKey = keys[0]; // por enquanto usa só a primeira
          console.log("Key principal para salvar no banco:", principalKey);

          await atualizarAmostra(amostraId, {
            imageLink: principalKey,
          });
        }
      }

      alert("Amostra registrada com sucesso!");
      navigate(`/projetos/${projetoId}/coletas/${coletaId}`);
    } catch (error) {
      console.error("Erro ao salvar amostra:", error);
      alert("Erro ao salvar amostra");
    }
  };

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Registrar Nova Amostra</h1>
          <p className="text-gray-600">Coleta: {coletaId}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 rounded border hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>
      </div>

      {/* Formulário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Identificação */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Identificação da Amostra
          </h2>
          <div className="flex flex-col gap-3">
            <input
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descrição da Amostra *"
              className="border rounded px-3 py-2"
            />
            <input
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              placeholder="Código de Identificação *"
              className="border rounded px-3 py-2"
            />
            <input
              name="tipoAmostra"
              value={form.tipoAmostra}
              onChange={handleChange}
              placeholder="Tipo de Amostra (Ex: Folha, Solo)"
              className="border rounded px-3 py-2"
            />
            <input
              name="identificacao_final"
              value={form.identificacao_final}
              onChange={handleChange}
              placeholder="Identificação Final"
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Armazenamento */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Armazenamento</h2>
          <div className="flex flex-col gap-3">
            <input
              name="recipiente"
              value={form.recipiente}
              onChange={handleChange}
              placeholder="Tipo de Recipiente *"
              className="border rounded px-3 py-2"
            />
            <input
              name="metodoPreservacao"
              value={form.metodoPreservacao}
              onChange={handleChange}
              placeholder="Método de Preservação *"
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Quantificação */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quantificação</h2>
          <div className="flex flex-col gap-3">
            <input
              name="quantidade"
              value={form.quantidade}
              onChange={handleChange}
              placeholder="Quantidade *"
              className="border rounded px-3 py-2"
            />
            <input
              name="validade"
              type="date"
              value={form.validade}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Observações */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Observações</h2>
          <textarea
            name="observacoes"
            value={form.observacoes}
            onChange={handleChange}
            placeholder="Observações gerais"
            className="border rounded px-3 py-2"
          />
        </div>

        {/* Área de upload de Imagens */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-3">
            Documentação Fotográfica
          </h2>

          <div
            className="border-2 border-dashed rounded-lg px-6 py-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagem}
              className="hidden"
            />
            <ImageIcon className="w-8 h-8 mb-2" />
            <p className="font-medium">Clique ou arraste as imagens aqui</p>
            <p className="text-sm text-gray-500">
              PNG, JPG • Máximo 10 imagens
            </p>
          </div>

          {form.imagens.length > 0 && (
            <ul className="mt-3 text-sm text-gray-700 list-disc list-inside">
              {form.imagens.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}

          {uploading && (
            <p className="text-sm text-blue-600 mt-2">
              Enviando imagens, aguarde...
            </p>
          )}
          {uploadError && (
            <p className="text-sm text-red-600 mt-2">{uploadError}</p>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          onClick={salvarAmostra}
          disabled={uploading}
          className="flex items-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-60"
        >
          <Plus className="w-4 h-4 mr-2" />
          {uploading ? "Salvando..." : "Registrar Amostra"}
        </button>
      </div>
    </div>
  );
}

export default NovaAmostra;
