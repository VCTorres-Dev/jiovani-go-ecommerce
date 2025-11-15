import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const getTagIcon = (tag) => {
  // Puedes personalizar estos íconos según tu preferencia o usar SVGs
  switch (tag.toLowerCase()) {
    case 'floral': return '🌸';
    case 'cítrico': return '🍋';
    case 'amaderado': return '🌲';
    case 'oriental': return '🪔';
    case 'fresco': return '💧';
    case 'frutal': return '🍎';
    case 'dulce': return '🍬';
    default: return '✨';
  }
};

const PerfumeDetailModal = ({ perfume, onClose }) => {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  if (!perfume) return null;

  // Lógica de imagen igual que en PerfumeCard
  const API_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/api$/, '') : 'http://localhost:5000';
  
  const imageSrc = perfume.imageURL
    ? (perfume.imageURL.startsWith('http') ? perfume.imageURL : `${API_BASE_URL}${perfume.imageURL}`)
    : generatePlaceholderSvg(perfume.name);

  const handleImageError = (e) => {
    e.target.src = generatePlaceholderSvg(perfume.name);
  };

  const generatePlaceholderSvg = (name) => {
    const encodedSvg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#grad1)"/>
        <circle cx="200" cy="180" r="40" fill="#d1d5db"/>
        <rect x="160" y="240" width="80" height="80" fill="#d1d5db" rx="8"/>
        <text x="200" y="360" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="14" font-weight="600">
          ${name || 'Dejo Aromas'}
        </text>
        <text x="200" y="380" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">
          Imagen no disponible
        </text>
      </svg>
    `);
    return `data:image/svg+xml,${encodedSvg}`;
  };

  const handleAddToCart = () => {
    addToCart(perfume);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        onClick={onClose} // Close on backdrop click
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors z-10"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>

          <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 flex items-center justify-center overflow-hidden">
            <img 
              src={imageSrc}
              alt={perfume.name}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {perfume.brand && (
                <p className="text-sm font-semibold text-gold uppercase tracking-wider">{perfume.brand}</p>
              )}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{perfume.name}</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">{perfume.description || 'No hay descripción disponible.'}</p>
              
              {perfume.tags && perfume.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-2">Notas Aromáticas:</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {perfume.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-gold-200 via-gold-100 to-gold-300 shadow-md text-gold-900 font-semibold text-base animate-fadeInChip"
                      >
                        {getTagIcon(tag)}
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8">
              <p className="text-4xl font-extrabold text-gray-900 mb-6">${perfume.price.toLocaleString('es-CL')}</p>
              <button 
                onClick={handleAddToCart}
                className="w-full bg-gold text-white py-3 px-6 rounded-lg text-lg font-bold hover:bg-darkGold transition-all flex items-center justify-center gap-3 transform hover:scale-105"
              >
                <ShoppingBagIcon className="h-6 w-6" />
                Añadir al Carrito
              </button>
              {/* Toast visual */}
              {showToast && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="fixed left-1/2 top-24 -translate-x-1/2 z-50 bg-gold text-white rounded-lg px-6 py-3 shadow-xl font-bold text-lg flex items-center gap-2 animate-fadeInToast"
                >
                  ¡Agregado al carrito!
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

PerfumeDetailModal.propTypes = {
  perfume: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string,
    description: PropTypes.string,
    imageURL: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func.isRequired,
};

export default PerfumeDetailModal;
