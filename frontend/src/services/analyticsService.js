import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE}/analytics`;

// Función estandarizada para obtener el token de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  // Fallback por si se usa la estructura antigua
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    return { Authorization: `Bearer ${userInfo.token}` };
  }
  return {};
};

// Obtener el resumen de KPIs
export const getSummary = async (params = {}) => {
  const config = { headers: getAuthHeaders(), params };
  const { data } = await axios.get(`${API_URL}/summary`, config);
  return data;
};

// Obtener datos de ventas para los gráficos
export const getSalesOverTime = async (params = {}) => {
  const config = { headers: getAuthHeaders(), params };
  const { data } = await axios.get(`${API_URL}/sales-over-time`, config);
  return data;
};

// Obtener los productos más vendidos
export const getTopProducts = async (params = {}) => {
  const config = { headers: getAuthHeaders(), params };
  const { data } = await axios.get(`${API_URL}/top-products`, config);
  return data;
};
