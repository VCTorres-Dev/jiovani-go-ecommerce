import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const API_URL = `${API_BASE}/products`;

export const getProducts = async (params = {}) => {
  try {
        // Parámetros por defecto para paginación si no se proporcionan
    const { gender, page = 1, limit = 10, search = '' } = params;

    const config = {
      params: { page, limit }
    };

    if (gender) {
      config.params.gender = gender;
    }

    if (search) {
      config.params.search = search;
    }

    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Error de red');
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Error de red');
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Error de red');
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Error de red');
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by id:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Error de red');
  }
};
