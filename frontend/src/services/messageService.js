import axios from 'axios';

const MESSAGES_API_URL = '/api/messages';

/**
 * Envía un mensaje de contacto al backend.
 * @param {object} messageData - Datos del mensaje (nombre, email, telefono, asunto, mensaje).
 * @returns {Promise<object>} La respuesta del servidor.
 */
// Helper para obtener el header de autorización
const getAuthHeaders = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    return { Authorization: `Bearer ${userInfo.token}` };
  }
  return {};
};

export const sendMessage = async (messageData) => {
  try {
    const { data } = await axios.post(MESSAGES_API_URL, messageData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al enviar el mensaje.';
  }
};

// --- Funciones para Admin ---

export const getMessages = async (status = '') => {
  try {
    const config = { 
      headers: getAuthHeaders(),
      params: { status }
    };
    const { data } = await axios.get(MESSAGES_API_URL, config);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener los mensajes.';
  }
};

export const getMessageById = async (id) => {
  try {
    const config = { headers: getAuthHeaders() };
    const { data } = await axios.get(`${MESSAGES_API_URL}/${id}`, config);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener el mensaje.';
  }
};

export const updateMessage = async (id, updateData) => {
  try {
    const config = { headers: getAuthHeaders() };
    const { data } = await axios.put(`${MESSAGES_API_URL}/${id}`, updateData, config);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al actualizar el mensaje.';
  }
};

export const deleteMessage = async (id) => {
  try {
    const config = { headers: getAuthHeaders() };
    await axios.delete(`${MESSAGES_API_URL}/${id}`, config);
    return { message: 'Mensaje eliminado' };
  } catch (error) {
    throw error.response?.data?.message || 'Error al eliminar el mensaje.';
  }
};
