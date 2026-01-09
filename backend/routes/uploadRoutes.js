const express = require("express");
const crypto = require("crypto");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const r2 = require("../config/r2Client");

const router = express.Router();

// PUT presign (upload)
router.post("/presign", async (req, res) => {
  console.log("=== [POST /uploads/presign] Requisição recebida ===");

  try {
    console.log("[presign] Body recebido:", req.body);

    const { filename, contentType, amostraId } = req.body;

    console.log("[presign] Campos extraídos:", {
      filename,
      contentType,
      amostraId,
      tipoFilename: typeof filename,
      tipoContentType: typeof contentType,
      tipoAmostraId: typeof amostraId,
    });

    if (!filename || !contentType || !amostraId) {
      console.warn(
        "[presign] Falha de validação - campos obrigatórios ausentes:",
        { filename, contentType, amostraId }
      );

      return res.status(400).json({
        error: "filename, contentType e amostraId são obrigatórios",
      });
    }

    const ext = filename.includes(".") ? filename.split(".").pop() : "bin";
    console.log("[presign] Extensão detectada:", ext);

    const key = `amostras/${amostraId}/${crypto.randomUUID()}.${ext}`;
    console.log("[presign] Key gerada para o objeto:", key);

    console.log("[presign] Bucket configurado:", process.env.R2_BUCKET);

    const cmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    console.log("[presign] PutObjectCommand criado:", {
      Bucket: cmd.input.Bucket,
      Key: cmd.input.Key,
      ContentType: cmd.input.ContentType,
    });

    console.log("[presign] Gerando URL assinada para upload...");
    const uploadUrl = await getSignedUrl(r2, cmd, { expiresIn: 60 * 5 });
    console.log("[presign] URL assinada gerada com sucesso.");

    // Não precisa logar a URL inteira se não quiser poluir o log
    console.log("[presign] Resposta final (parcial da URL):", {
      key,
      uploadUrlPreview: uploadUrl.slice(0, 80) + "...",
    });

    return res.json({ uploadUrl, key });
  } catch (error) {
    console.error("=== [presign] Erro ao gerar presign ===");
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);

    return res
      .status(500)
      .json({ error: "Falha ao gerar URL de upload" });
  }
});


// GET presign (download/preview)
router.post("/presign-get", async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: "key é obrigatório" });
    }

    const cmd = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    });

    const url = await getSignedUrl(r2, cmd, { expiresIn: 60 * 5 }); // 5 min

    return res.json({ url });
  } catch (error) {
    console.error("Erro ao gerar presign-get:", error);
    return res.status(500).json({ error: "Falha ao gerar URL de download" });
  }
});

module.exports = router;
