import React from 'react';
import PropTypes from 'prop-types';


const PerfumeCard = ({ perfume, onCardClick }) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/api$/, '') : 'http://localhost:5000';

  // Corrige el nombre del campo a 'imageUrl' y construye la ruta completa.
  // Añade una imagen de fallback si no existe.
    const imageSrc = perfume.imageURL
    ? (perfume.imageURL.startsWith('http') ? perfume.imageURL : `${API_BASE_URL}${perfume.imageURL}`)
    : 'https://via.placeholder.com/400x500.png?text=Dejo+Aromas';

  const handleImageError = (e) => {
    // Sets a placeholder image if the original image fails to load
    e.target.src = 'https://via.placeholder.com/400x500.png?text=Dejo+Aromas';
  };



  return (
    // The 'group' class is essential for group-hover effects
    <div 
      className="group relative border border-transparent hover:border-gold-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white cursor-pointer"
      onClick={() => onCardClick(perfume)}
    >
      {/* Image container with aspect ratio and overflow hidden for zoom effect */}
      <div className="aspect-w-4 aspect-h-5 bg-gray-100 overflow-hidden">
        <img
          src={imageSrc}
          alt={perfume.name}
          onError={handleImageError}
          loading="lazy" // Lazy loading for better performance
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>

      {/* Product information */}
      <div className="p-4 text-center">
        <h3 className="text-md font-semibold text-gray-800 truncate" title={perfume.name}>{perfume.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{perfume.brand}</p>
        <p className="text-lg font-bold text-gold mt-2">
          ${perfume.price ? perfume.price.toLocaleString('es-CL') : 'N/A'}
        </p>
      </div>


    </div>
  );
};

PerfumeCard.propTypes = {
  perfume: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string,
    price: PropTypes.number.isRequired,
        imageURL: PropTypes.string,
  }).isRequired,
};

export default PerfumeCard;
