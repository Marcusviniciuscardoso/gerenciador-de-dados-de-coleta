import api from "./api"; // seu axios instance

export function getPresignedGetUrl(key) {
  return api.get(`/uploads/presign-get`, { params: { key } });
}
