import api from "./api"; // seu axios instance

export function getPresignedGetUrl(key) {
  return api.post("/uploads/presign-get", { key });
}

export function presignUpload({ filename, contentType, amostraId }) {
  return api.post("/uploads/presign", { filename, contentType, amostraId });
}
