const express = require("express");
const crypto = require("crypto");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const r2 = require("../config/r2Client");

const router = express.Router();

// PUT presign (upload)
router.post("/presign", async (req, res) => {
  try {
    const { filename, contentType, amostraId } = req.body;

    if (!filename || !contentType || !amostraId) {
      return res
        .status(400)
        .json({ error: "filename, contentType e amostraId são obrigatórios" });
    }

    const ext = filename.includes(".") ? filename.split(".").pop() : "bin";
    const key = `amostras/${amostraId}/${crypto.randomUUID()}.${ext}`;

    const cmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2, cmd, { expiresIn: 60 * 5 });

    return res.json({ uploadUrl, key });
  } catch (error) {
    console.error("Erro ao gerar presign:", error);
    return res.status(500).json({ error: "Falha ao gerar URL de upload" });
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
