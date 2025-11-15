import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const PaymentSimulate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [simulationData, setSimulationData] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const orderId = urlParams.get('order');

    if (token && orderId) {
      setSimulationData({ token, orderId });
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const handleSimulatePayment = (success = true) => {
    setLoading(true);
    
    // Simular tiempo de procesamiento
    setTimeout(() => {
      const resultUrl = `/payment/result?token_ws=${simulationData.token}&order=${simulationData.orderId}`;
      navigate(resultUrl);
    }, 2000);
  };

  if (!simulationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-3xl opacity-10 scale-110"></div>
        
        <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-w-lg w-full overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <RocketLaunchIcon className="h-8 w-8" />
                <h1 className="text-2xl font-bold">jiovaniGo Chile</h1>
              </div>
              <p className="opacity-90">Portal Seguro de Pagos</p>
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 rounded-full"></div>
          </div>

          <div className="p-8">
            {/* Development Notice - Elegant */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <SparklesIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-amber-800">Modo Desarrollo</h3>
                </div>
                <p className="text-amber-700 leading-relaxed">
                  Estás en el <strong>simulador de pagos</strong> para pruebas. En producción, 
                  serás redirigido automáticamente a la plataforma segura de Transbank.
                </p>
              </div>
            </div>

            {/* Transaction Info - Redesigned */}
            <div className="space-y-4 mb-8">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
                  <p className="font-semibold text-gray-800">Token de Transacción</p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="font-mono text-sm text-gray-700 break-all">{simulationData.token}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCardIcon className="h-5 w-5 text-blue-600" />
                  <p className="font-semibold text-blue-800">ID de Orden</p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="font-mono text-sm text-blue-700 break-all">{simulationData.orderId}</p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <ClockIcon className="h-8 w-8 text-indigo-600 mx-auto absolute top-6 left-1/2 transform -translate-x-1/2" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Procesando Pago</h3>
                <p className="text-gray-600">Simulando transacción segura...</p>
                <div className="flex justify-center gap-1 mt-4">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            ) : (
              <>
                {/* Action Buttons - Premium Design */}
                <div className="space-y-4 mb-8">
                  <button
                    onClick={() => handleSimulatePayment(true)}
                    className="group w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <CheckCircleIcon className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                    <span>Simular Pago Exitoso</span>
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  
                  <button
                    onClick={() => handleSimulatePayment(false)}
                    className="group w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <XCircleIcon className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                    <span>Simular Pago Fallido</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors border border-gray-200 hover:border-gray-300"
                  >
                    Cancelar y Volver
                  </button>
                </div>

                {/* Test Cards - Elegant Design */}
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                    <CreditCardIcon className="h-5 w-5 text-indigo-600" />
                    Tarjetas de Prueba Transbank
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="bg-white border border-green-200 rounded-lg p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-full transform translate-x-6 -translate-y-6"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-semibold text-green-800">Pago Exitoso</span>
                        </div>
                        <p className="font-mono text-green-700 text-lg font-semibold tracking-wide">
                          4051 8856 0044 6623
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-red-200 rounded-lg p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-full transform translate-x-6 -translate-y-6"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-semibold text-red-800">Pago Fallido</span>
                        </div>
                        <p className="font-mono text-red-700 text-lg font-semibold tracking-wide">
                          4051 8856 0044 6648
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
                      <p className="text-indigo-700 text-sm">
                        <strong>CVV:</strong> 123 | <strong>Fecha:</strong> Cualquier fecha futura
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Footer with brand */}
          <div className="bg-gray-50/80 px-8 py-4 border-t border-gray-200/50">
            <p className="text-center text-gray-600 text-sm">
              Powered by <span className="font-semibold text-indigo-600">jiovaniGo Chile</span> 
              <span className="mx-2">•</span> 
              Transbank Integration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSimulate;
