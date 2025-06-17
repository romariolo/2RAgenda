import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// "Interceptor": Uma função que roda antes de toda requisição ser enviada.
api.interceptors.request.use(async config => {
  // Pega o token do localStorage
  const token = localStorage.getItem('authToken');
  
  // Se o token existir, anexa ele no cabeçalho 'Authorization'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;