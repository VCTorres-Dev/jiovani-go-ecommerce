import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/api$/, '') : 'http://localhost:5000';
  
  // Corrige el nombre del campo a 'imageUrl' y construye la ruta completa.
  // Añade una imagen de fallback si no existe.
  const imageSrc = product.imageUrl 
    ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${API_BASE_URL}${product.imageUrl}`)
    : 'https://via.placeholder.com/400x400.png?text=Sin+Imagen'; // Fallback image

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
      <Link to={`/product/${product._id}`}>
        <img src={imageSrc} alt={product.name} className="w-full h-64 object-cover" />
      </Link>
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
        <p className="text-xl text-gold-600 font-semibold mt-2">${product.price}</p>
        <Link to={`/product/${product._id}`}>
          <button className="mt-4 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
            Ver Detalles
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
