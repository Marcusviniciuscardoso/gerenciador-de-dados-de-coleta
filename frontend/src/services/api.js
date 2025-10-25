import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://gerenciador-de-dados-de-coleta-production.up.railway.app',
  withCredentials: true
});

export default api;
