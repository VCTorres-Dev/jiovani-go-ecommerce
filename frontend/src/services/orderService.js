import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE}/orders`;

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

/**
 * Crea una nueva orden en la base de datos.
 * @param {object} orderData - Los datos de la orden, incluyendo `orderItems` y `totalAmount`.
 * @returns {Promise<object>} La orden creada.
 */
export const createOrder = async (orderData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  };
  
  const { data } = await axios.post(API_URL, orderData, config);
  return data;
};
