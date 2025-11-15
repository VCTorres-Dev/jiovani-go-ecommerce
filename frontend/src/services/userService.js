import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const API_URL = `${API_BASE}/users`;

// Obtener todos los usuarios con paginación y búsqueda
export const getUsers = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Error de red');
  }
};

// Actualizar el rol de un usuario
export const updateUserRole = async (id, role) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { role });
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Error de red');
  }
};

// Eliminar un usuario
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Error de red');
  }
};
