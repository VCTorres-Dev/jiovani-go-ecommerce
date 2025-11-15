import axios from 'axios';

// Configuración base de la API
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const PAYMENTS_API_URL = `${API_BASE}/payments`;

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return {
    'Content-Type': 'application/json'
  };
};

/**
 * Iniciar proceso de pago con Transbank
 * @param {Object} orderData - Datos de la orden
 * @param {Array} orderData.orderItems - Productos en el carrito
 * @param {number} orderData.totalAmount - Monto total
 * @param {Object} orderData.shippingInfo - Información de envío
 * @returns {Promise<Object>} Respuesta con token y URL de Transbank
 */
export const initPayment = async (orderData) => {
  try {
    console.log('🚀 Iniciando pago con datos:', {
      items: orderData.orderItems.length,
      total: orderData.totalAmount,
      shipping: orderData.shippingInfo.name
    });

    const config = {
      headers: getAuthHeaders(),
    };

    const response = await axios.post(`${PAYMENTS_API_URL}/init`, orderData, config);
    
    console.log('✅ Pago iniciado exitosamente:', {
      orderId: response.data.data.orderId,
      isSimulation: response.data.data.isSimulation || false
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error al iniciar pago:', error.response ? error.response.data : error.message);
    
    // Manejar diferentes tipos de errores
    if (error.response) {
      // Error del servidor con respuesta
      throw new Error(error.response.data.message || 'Error del servidor al iniciar el pago');
    } else if (error.request) {
      // Error de red
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      // Error de configuración
      throw new Error('Error inesperado al procesar la solicitud');
    }
  }
};

/**
 * Confirmar pago (usado internamente por el sistema)
 * @param {string} token - Token de Transbank
 * @returns {Promise<Object>} Resultado de la confirmación
 */
export const confirmPayment = async (token) => {
  try {
    console.log('🔄 Confirmando pago con token:', token.substring(0, 20) + '...');

    const response = await axios.post(`${PAYMENTS_API_URL}/confirm`, {
      token_ws: token
    });

    console.log('✅ Pago confirmado:', {
      success: response.data.success,
      orderId: response.data.data.orderId
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error confirmando pago:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Error al confirmar el pago');
  }
};

/**
 * Obtener estado de una orden específica
 * @param {string} orderId - ID de la orden
 * @returns {Promise<Object>} Datos de la orden
 */
export const getOrderStatus = async (orderId) => {
  try {
    console.log('📋 Obteniendo estado de orden:', orderId);

    const config = {
      headers: getAuthHeaders(),
    };

    const response = await axios.get(`${PAYMENTS_API_URL}/order/${orderId}`, config);
    
    console.log('✅ Estado de orden obtenido:', {
      orderId: response.data.data._id,
      status: response.data.data.status
    });

    return response.data.data;
  } catch (error) {
    console.error('❌ Error obteniendo estado de orden:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener el estado de la orden');
  }
};

/**
 * Obtener todas las órdenes del usuario autenticado
 * @param {number} page - Página a obtener
 * @param {number} limit - Límite de órdenes por página
 * @returns {Promise<Object>} Lista de órdenes del usuario
 */
export const getUserOrders = async (page = 1, limit = 10) => {
  try {
    console.log(`📋 Obteniendo órdenes del usuario (página ${page})`);

    const config = {
      headers: getAuthHeaders(),
    };

    const response = await axios.get(`${PAYMENTS_API_URL}/orders?page=${page}&limit=${limit}`, config);
    
    console.log('✅ Órdenes obtenidas:', {
      total: response.data.data.total,
      currentPage: response.data.data.currentPage
    });

    return response.data.data;
  } catch (error) {
    console.error('❌ Error obteniendo órdenes del usuario:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener las órdenes');
  }
};

/**
 * Verificar si el sistema de pagos está funcionando
 * @returns {Promise<Object>} Estado del sistema
 */
export const checkPaymentSystemHealth = async () => {
  try {
    const response = await axios.get(`${PAYMENTS_API_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('❌ Error verificando sistema de pagos:', error.message);
    throw new Error('Sistema de pagos no disponible');
  }
};

/**
 * Formatear datos de la orden para envío a Transbank
 * @param {Array} cartItems - Productos en el carrito
 * @param {Object} shippingInfo - Información de envío
 * @returns {Object} Datos formateados para la API
 */
export const formatOrderData = (cartItems, shippingInfo) => {
  const orderItems = cartItems.map(item => ({
    _id: item._id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    imageURL: item.imageURL
  }));

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    orderItems,
    totalAmount,
    shippingInfo: {
      name: shippingInfo.name.trim(),
      email: shippingInfo.email.trim().toLowerCase(),
      phone: shippingInfo.phone.trim(),
      address: shippingInfo.address.trim(),
      city: shippingInfo.city.trim(),
      region: shippingInfo.region
    }
  };
};

/**
 * Validar información de envío
 * @param {Object} shippingInfo - Información de envío
 * @returns {Array<string>} Lista de errores de validación
 */
export const validateShippingInfo = (shippingInfo) => {
  const errors = [];
  const requiredFields = [
    { field: 'name', label: 'Nombre completo' },
    { field: 'email', label: 'Email' },
    { field: 'phone', label: 'Teléfono' },
    { field: 'address', label: 'Dirección' },
    { field: 'city', label: 'Ciudad' },
    { field: 'region', label: 'Región' }
  ];

  requiredFields.forEach(({ field, label }) => {
    if (!shippingInfo[field] || !shippingInfo[field].trim()) {
      errors.push(`${label} es requerido`);
    }
  });

  // Validación específica de email
  if (shippingInfo.email && shippingInfo.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email.trim())) {
      errors.push('Email debe tener un formato válido');
    }
  }

  // Validación específica de teléfono chileno
  if (shippingInfo.phone && shippingInfo.phone.trim()) {
    const phoneRegex = /^(\+56)?[0-9]{8,9}$/;
    const cleanPhone = shippingInfo.phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errors.push('Teléfono debe tener formato chileno válido (+56912345678 o 912345678)');
    }
  }

  return errors;
};

// Exportaciones por defecto
export default {
  initPayment,
  confirmPayment,
  getOrderStatus,
  getUserOrders,
  checkPaymentSystemHealth,
  formatOrderData,
  validateShippingInfo
};
