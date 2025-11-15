import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { formatPriceCLP } from '../utils/formatters';
import Checkout from './Checkout';
import {
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ShoppingBagIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const Cart = () => {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, addToCart, decrementFromCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Debes iniciar sesión para realizar la compra.');
      return;
    }

    if (cartItems.length === 0) {
      toast.info('Tu carrito está vacío.');
      return;
    }

    // Abrir el modal de checkout
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 lg:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Cart Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800">Mi Carrito</h3>
          <button
            onClick={toggleCart}
            className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Cerrar carrito"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        {/* Cart Body */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6 bg-gray-50">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 pt-16">
              <ShoppingBagIcon className="h-20 w-20 mb-6 opacity-40" />
              <p className="text-xl font-medium">Tu carrito está vacío.</p>
              <p className="text-sm text-gray-400 mt-1">Añade algunos productos para empezar.</p>
            </div>
          ) : (
            cartItems.map(item => {
              // Usar la MISMA lógica que funciona en PerfumeCard.js
              const API_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/api$/, '') : 'http://localhost:5000';
              
              const imageSrc = item.imageURL
                ? (item.imageURL.startsWith('http') ? item.imageURL : `${API_BASE_URL}${item.imageURL}`)
                : 'https://via.placeholder.com/400x500.png?text=Dejo+Aromas';

              const handleImageError = (e) => {
                // Sets a placeholder image if the original image fails to load
                e.target.src = 'https://via.placeholder.com/400x500.png?text=Dejo+Aromas';
              };

              return (
                <div key={item._id} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <img
                    src={imageSrc}
                    alt={item.name}
                    onError={handleImageError}
                    loading="lazy"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-100"
                  />
                  <div className="flex-grow">
                    <p className="text-lg font-semibold text-gray-800 mb-1">{item.name}</p>
                    <p className="text-md text-gold font-semibold mb-2">{formatPriceCLP(item.price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => decrementFromCart(item._id)}
                        className="p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                        aria-label="Disminuir cantidad"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                      <span className="font-medium text-gray-700 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)} // Assumes addToCart handles incrementing existing items
                        className="p-1.5 bg-gold hover:bg-darkGold text-white rounded-full transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1 self-start mt-1"
                    aria-label="Eliminar producto"
                  >
                    <TrashIcon className="h-6 w-6" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-white space-y-5 shadow-top-md">
            <div className="flex justify-between items-center text-xl">
              <span className="text-gray-700 font-medium">Subtotal:</span>
              <span className="font-semibold text-gray-900">{formatPriceCLP(subtotal)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-gold hover:bg-darkGold text-white py-3.5 px-6 rounded-lg text-lg font-bold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
              <CreditCardIcon className="h-6 w-6" />
              Finalizar Compra
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <Checkout 
        isOpen={isCheckoutOpen} 
        onClose={handleCloseCheckout}
      />
    </>
  );
};

export default Cart;
