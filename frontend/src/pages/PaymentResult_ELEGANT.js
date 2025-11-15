import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmPayment, getOrderStatus } from '../services/paymentService';
import { formatPriceCLP } from '../utils/formatters';
import { toast } from 'react-toastify';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  CreditCardIcon,
  TruckIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token_ws');
        const orderId = urlParams.get('order');

        console.log('🔄 Procesando resultado de pago...', { token: token?.substring(0, 20), orderId });

        if (!token) {
          setError('Token de transacción no encontrado en la URL');
          setLoading(false);
          return;
        }

        // Confirmar el pago con nuestro backend
        console.log('💳 Confirmando pago...');
        const confirmResult = await confirmPayment(token);
        setPaymentStatus(confirmResult);

        if (confirmResult.success && confirmResult.data.orderId) {
          // Obtener los detalles completos de la orden
          console.log('📋 Obteniendo detalles de la orden...');
          const orderDetails = await getOrderStatus(confirmResult.data.orderId);
          setOrder(orderDetails);
          
          // Mostrar mensaje apropiado
          if (confirmResult.success) {
            toast.success(confirmResult.message);
          } else {
            toast.warning(confirmResult.message || 'El pago fue procesado pero hubo problemas con la confirmación');
          }
        } else {
          setError(confirmResult.message || 'No se pudo confirmar el pago');
        }

      } catch (err) {
        console.error('❌ Error procesando resultado de pago:', err);
        setError('Error al procesar el resultado del pago. Por favor contacta con soporte.');
      } finally {
        setLoading(false);
      }
    };

    processPaymentResult();
  }, [location.search]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto" />;
      case 'failed':
        return <XCircleIcon className="h-20 w-20 text-red-500 mx-auto" />;
      case 'processing':
        return <ClockIcon className="h-20 w-20 text-yellow-500 mx-auto" />;
      default:
        return <ClockIcon className="h-20 w-20 text-gray-500 mx-auto" />;
    }
  };

  const getStatusMessage = (status, isSimulation = false) => {
    const simulationText = isSimulation ? ' (Simulado)' : '';
    
    switch (status) {
      case 'completed':
        return {
          title: `¡Pago Completado con Éxito!${simulationText}`,
          message: isSimulation 
            ? 'Tu pago simulado ha sido procesado correctamente. En producción recibirás un email de confirmación.'
            : 'Tu pago ha sido procesado exitosamente. Recibirás un email de confirmación con todos los detalles.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'failed':
        return {
          title: `Pago No Procesado${simulationText}`,
          message: 'No se pudo completar tu pago. Por favor intenta nuevamente o contacta con nuestro equipo de soporte.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'processing':
        return {
          title: `Pago en Proceso${simulationText}`,
          message: 'Tu pago está siendo verificado. Te notificaremos una vez que se complete la transacción.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      default:
        return {
          title: 'Estado de Pago',
          message: 'Verificando el estado de tu transacción...',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  // Componente de loading elegante
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gold-600 rounded-full animate-spin mx-auto"></div>
            <ClockIcon className="h-6 w-6 text-gold-600 absolute top-5 left-1/2 transform -translate-x-1/2" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">Procesando tu pago</h2>
          <p className="text-gray-600">Por favor espera mientras confirmamos tu transacción...</p>
        </div>
      </div>
    );
  }

  // Componente de error elegante
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
          <XCircleIcon className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-red-600 mb-4 font-['Playfair_Display']">Error en el Pago</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/catalogo-dama')}
              className="w-full px-8 py-3 bg-gold-600 hover:bg-gold-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Volver al Catálogo
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay order pero tampoco error, mostrar un estado de no encontrado
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
          <ClockIcon className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-700 mb-4 font-['Playfair_Display']">Orden no encontrada</h1>
          <p className="text-gray-600 mb-8">No pudimos encontrar la información de tu orden.</p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/catalogo-dama')}
              className="w-full px-8 py-3 bg-gold-600 hover:bg-gold-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Ir al Catálogo
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusMessage(order?.status, paymentStatus?.data?.isSimulation);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header elegante con estado del pago */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-200">
            <div className="mb-8">
              {getStatusIcon(order?.status)}
            </div>
            <h1 className={`text-4xl font-extrabold ${statusInfo.color} mb-4 font-['Playfair_Display']`}>
              {statusInfo.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{statusInfo.message}</p>
            {paymentStatus?.data?.isSimulation && (
              <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                <ClockIcon className="w-4 h-4 mr-2" />
                Modo Simulación
              </div>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Columna principal - Detalles de transacción */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Resumen de orden */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <ShoppingBagIcon className="h-6 w-6 text-gold-600" />
                  <h3 className="text-2xl font-bold text-gray-900 font-['Playfair_Display']">Detalles de la Transacción</h3>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-500 mb-2">Número de orden</label>
                      <p className="font-mono text-lg font-bold text-gray-900">{order?._id}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-500 mb-2">Fecha y hora</label>
                      <p className="text-lg font-semibold text-gray-900">{order && new Date(order.createdAt).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                      <label className="block text-sm font-semibold text-green-600 mb-2">Estado del pago</label>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-lg font-bold text-green-700">
                          {order?.getPaymentStatusText ? order.getPaymentStatusText() : order?.status}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gold-50 p-6 rounded-xl border border-gold-200">
                      <label className="block text-sm font-semibold text-gold-700 mb-2">Total pagado</label>
                      <p className="text-3xl font-bold text-gold-600 font-['Playfair_Display']">
                        {order && formatPriceCLP(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                {order?.transbank?.authorizationCode && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCardIcon className="h-6 w-6 text-blue-600" />
                        <span className="text-blue-700 font-semibold">Código de autorización</span>
                      </div>
                      <span className="font-mono text-lg font-bold text-blue-600">{order.transbank.authorizationCode}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Información de método de pago */}
            {order?.transbank && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="h-6 w-6 text-gold-600" />
                    <h4 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">Información de Pago</h4>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {order.transbank.paymentTypeCode && (
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <label className="block text-sm font-semibold text-gray-500 mb-2">Tipo de pago</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {order.transbank.paymentTypeCode === 'VD' ? 'Tarjeta de Débito' : 'Tarjeta de Crédito'}
                        </p>
                      </div>
                    )}
                    {order.transbank.cardNumber && (
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <label className="block text-sm font-semibold text-gray-500 mb-2">Tarjeta terminada en</label>
                        <p className="font-mono text-lg font-bold text-gray-900">{order.transbank.cardNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Comprobante de compra - Refinado */}
            {paymentStatus?.data?.email?.previewURL && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="h-6 w-6 text-gold-600" />
                    <h4 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">Comprobante de Compra</h4>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-gray-900">Email enviado exitosamente</h5>
                      <p className="text-gray-600">Para: {order?.shippingInfo?.email}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        ✓ Entregado
                      </span>
                    </div>
                  </div>

                  <a
                    href={paymentStatus.data.email.previewURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full bg-gold-600 hover:bg-gold-700 text-white py-4 px-8 rounded-xl font-bold text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <DocumentTextIcon className="w-6 h-6" />
                    <span className="text-lg">Ver Comprobante de Compra</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>

                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-700 text-center">
                      💡 <strong>Modo desarrollo:</strong> En producción, este email llegará directamente a tu bandeja de entrada
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Columna lateral - Información de envío y acciones */}
          <div className="space-y-8">
            
            {/* Información de envío */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <TruckIcon className="h-6 w-6 text-gold-600" />
                  <h3 className="text-lg font-bold text-gray-900 font-['Playfair_Display']">Información de Envío</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre completo</label>
                  <p className="font-semibold text-gray-900">{order?.shippingInfo?.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                  <p className="font-semibold text-gray-900 break-all">{order?.shippingInfo?.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Teléfono</label>
                  <p className="font-semibold text-gray-900">{order?.shippingInfo?.phone}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Dirección de envío</label>
                  <p className="font-semibold text-gray-900 leading-relaxed">
                    {order?.shippingInfo?.address}<br />
                    {order?.shippingInfo?.city}, {order?.shippingInfo?.region}
                  </p>
                </div>
              </div>
            </div>

            {/* Próximos pasos */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-6 w-6 text-gold-600" />
                  <h4 className="text-lg font-bold text-gray-900 font-['Playfair_Display']">Próximos Pasos</h4>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { icon: "📧", text: "Recibirás email de confirmación cuando el pedido esté listo para envío" },
                    { icon: "📦", text: "Preparamos tu pedido cuidadosamente en 24-48 horas" },
                    { icon: "🚚", text: "El envío toma entre 2-5 días según tu ubicación" },
                    { icon: "📱", text: "Te enviaremos el código de seguimiento por email" }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-xl flex-shrink-0">{step.icon}</span>
                      <span className="text-sm text-gray-700 font-medium leading-relaxed">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-4">
              <button
                onClick={() => navigate('/catalogo-dama')}
                className="w-full bg-gold-600 hover:bg-gold-700 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span>Seguir Comprando</span>
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>

        {/* Lista de productos comprados */}
        {order?.products && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ShoppingBagIcon className="h-6 w-6 text-gold-600" />
                <h3 className="text-2xl font-bold text-gray-900 font-['Playfair_Display']">Productos Comprados</h3>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-6">
                {order.products.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-6">
                      {item.imageURL && (
                        <img
                          src={`http://localhost:5000${item.imageURL}`}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-md"
                        />
                      )}
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h4>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Cantidad: <span className="font-semibold text-gray-900">{item.quantity}</span></p>
                          <p className="text-sm text-gray-600">Precio unitario: <span className="font-semibold text-gray-900">{formatPriceCLP(item.price)}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gold-600 font-['Playfair_Display']">
                        {formatPriceCLP(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer con información de jiovaniGo Chile */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">¡Gracias por confiar en nosotros!</h4>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              En <strong>jiovaniGo Chile</strong> nos comprometemos a brindarte la mejor experiencia en fragancias exclusivas. 
              Cualquier consulta, no dudes en contactarnos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
