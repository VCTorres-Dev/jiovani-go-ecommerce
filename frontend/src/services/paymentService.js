import axios from 'axios';

// Configuración base de la API
const API_BASE = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL_REAL || 'https://jiovani-go-ecommerce-production.up.railway.app/api';
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

    // Intentar endpoint de guest (sin autenticación requerida)
    // Si falla, como compatibilidad, intentar /init-test (legacy)
    let response;
    try {
      response = await axios.post(`${PAYMENTS_API_URL}/init-guest`, orderData);
    } catch (err) {
      console.warn('fallback: init-guest falló, intentando init-test', err.response?.data || err.message);
      response = await axios.post(`${PAYMENTS_API_URL}/init-test`, orderData);
    }
    
    console.log('✅ Pago iniciado exitosamente:', {
      token: response.data.data.token.substring(0, 20) + '...',
      url: response.data.data.url,
      environment: response.data.data.environment
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
 * Soporta múltiples formas de parámetros según lo que Transbank devuelve:
 * - token_ws: Flujo normal (éxito o rechazo)
 * - TBK_TOKEN: Usuario canceló
 * - TBK_ORDEN_COMPRA + TBK_ID_SESION: Timeout
 * 
 * @param {string|object} tokenOrPayload - Token string O payload con parámetros
 * @param {object} additionalParams - Parámetros adicionales (TBK_ORDEN_COMPRA, etc)
 * @returns {Promise<Object>} Resultado de la confirmación
 */
export const confirmPayment = async (tokenOrPayload, additionalParams = {}) => {
  try {
    let payload = {};

    // Caso 1: Parámetro único (token string)
    if (typeof tokenOrPayload === 'string') {
      // Si es un token de Transbank, determinar si es token_ws o TBK_TOKEN
      if (tokenOrPayload && tokenOrPayload.length > 10) {
        payload.token_ws = tokenOrPayload;
        console.log('🔄 Confirmando pago con token_ws:', tokenOrPayload.substring(0, 20) + '...');
      } else {
        console.log('❌ Token inválido recibido:', tokenOrPayload);
        throw new Error('Token inválido');
      }
    }
    // Caso 2: Parámetro es un objeto (payload completo)
    else if (typeof tokenOrPayload === 'object' && tokenOrPayload !== null) {
      payload = tokenOrPayload;
      console.log('🔄 Confirmando pago con payload:', Object.keys(payload).join(', '));
    }
    
    // Agregar parámetros adicionales si existen
    if (Object.keys(additionalParams).length > 0) {
      payload = { ...payload, ...additionalParams };
    }

    // Validar que haya al menos un parámetro
    if (Object.keys(payload).length === 0) {
      throw new Error('No se proporcionaron parámetros para confirmar el pago');
    }

    console.log('📤 Enviando confirmación al backend:', {
      hasTokenWs: !!payload.token_ws,
      hasTBKToken: !!payload.TBK_TOKEN,
      hasBuyOrder: !!payload.TBK_ORDEN_COMPRA,
      hasSessionId: !!payload.TBK_ID_SESION
    });

    // CAMBIO: Forzar headers explícitos para asegurar que el backend reciba el body correctamente
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.post(`${PAYMENTS_API_URL}/confirm`, payload, config);

    console.log('✅ Pago confirmado:', {
      success: response.data.success,
      orderId: response.data.data?.orderId,
      status: response.data.data?.status,
      reason: response.data.reason
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error confirmando pago:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data
    });
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
