import api from "./api"; // seu axios instance

export function getPresignedGetUrl(key) {
  return api.post("/uploads/presign-get", { key });
}
