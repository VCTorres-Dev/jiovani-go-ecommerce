import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { initPayment, formatOrderData, validateShippingInfo } from '../services/paymentService';
import { toast } from 'react-toastify';
import { formatPriceCLP } from '../utils/formatters';
import {
  XMarkIcon,
  CreditCardIcon,
  TruckIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Checkout = ({ isOpen, onClose }) => {
  const { cartItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const chileanRegions = [
    'Arica y Parinacota',
    'Tarapacá',
    'Antofagasta',
    'Atacama',
    'Coquimbo',
    'Valparaíso',
    'Metropolitana',
    'O\'Higgins',
    'Maule',
    'Ñuble',
    'Biobío',
    'La Araucanía',
    'Los Ríos',
    'Los Lagos',
    'Aysén',
    'Magallanes'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores de validación cuando el usuario escribe
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Verificar autenticación
    if (!localStorage.getItem('token')) {
      toast.error('Debes iniciar sesión para realizar la compra.');
      return;
    }

    // Verificar carrito
    if (cartItems.length === 0) {
      toast.info('Tu carrito está vacío.');
      return;
    }

    // Validar información de envío
    const errors = validateShippingInfo(shippingInfo);
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error('Por favor corrige los errores en el formulario.');
      return;
    }

    setIsProcessing(true);
    setValidationErrors([]);

    try {
      // Formatear datos de la orden
      const orderData = formatOrderData(cartItems, shippingInfo);

      console.log('🛒 Procesando compra:', {
        productos: orderData.orderItems.length,
        total: orderData.totalAmount,
        cliente: orderData.shippingInfo.name
      });

      // Iniciar pago con Transbank
      const response = await initPayment(orderData);

      if (response.success) {
        // Limpiar carrito antes de redirigir
        clearCart();
        
        // Mostrar mensaje de éxito
        if (response.data.isSimulation) {
          toast.success('Redirigiendo al simulador de pagos...');
        } else {
          toast.success('Redirigiendo a Transbank...');
        }

        // Cerrar modal
        onClose();

        // Redirigir a Transbank o simulador
        console.log('🔄 Redirigiendo a:', response.data.url);
        window.location.href = `${response.data.url}?token_ws=${response.data.token}`;
      } else {
        throw new Error(response.message || 'Error iniciando el pago');
      }

    } catch (error) {
      console.error('❌ Error en checkout:', error);
      toast.error(error.message || 'Hubo un error al procesar el pago. Inténtalo nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // No renderizar si no está abierto
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <CreditCardIcon className="h-7 w-7 text-gold" />
              Finalizar Compra
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isProcessing}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Columna izquierda: Información de envío */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TruckIcon className="h-5 w-5 text-gold" />
                    Información de Envío
                  </h3>
                  
                  {/* Mostrar errores de validación */}
                  {validationErrors.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center gap-2 text-red-800 mb-2">
                        <ExclamationTriangleIcon className="h-5 w-5" />
                        <span className="font-medium">Por favor corrige los siguientes errores:</span>
                      </div>
                      <ul className="list-disc list-inside text-sm text-red-700">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={shippingInfo.name}
                        onChange={handleInputChange}
                        required
                        disabled={isProcessing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold disabled:bg-gray-100"
                        placeholder="Juan Pérez"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        required
                        disabled={isProcessing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold disabled:bg-gray-100"
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        required
                        disabled={isProcessing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold disabled:bg-gray-100"
                        placeholder="+56912345678"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Región *
                      </label>
                      <select
                        name="region"
                        value={shippingInfo.region}
                        onChange={handleInputChange}
                        required
                        disabled={isProcessing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold disabled:bg-gray-100"
                      >
                        <option value="">Selecciona una región</option>
                        {chileanRegions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        required
                        disabled={isProcessing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold disabled:bg-gray-100"
                        placeholder="Santiago"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        required
                        disabled={isProcessing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold disabled:bg-gray-100"
                        placeholder="Av. Providencia 123, Depto 45"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha: Resumen de la orden */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ShoppingBagIcon className="h-5 w-5 text-gold" />
                    Resumen de tu orden
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    {cartItems.map(item => (
                      <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageURL}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-gray-500 text-xs">Cantidad: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-sm">{formatPriceCLP(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total a pagar:</span>
                      <span className="text-gold">{formatPriceCLP(subtotal)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Incluye envío a domicilio</p>
                  </div>
                </div>

                {/* Información de seguridad */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">🔒 Pago Seguro</h4>
                  <p className="text-sm text-blue-700">
                    Tu pago será procesado de forma segura a través de Transbank, 
                    el sistema de pagos más confiable de Chile.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isProcessing || cartItems.length === 0}
                className="flex-1 px-6 py-3 bg-gold text-white rounded-lg hover:bg-darkGold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="h-5 w-5" />
                    Pagar {formatPriceCLP(subtotal)}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
