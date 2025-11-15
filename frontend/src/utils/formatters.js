export const formatPriceCLP = (price) => {
  if (typeof price !== 'number') {
    return '$0';
  }
  // Formatea el número a un string con separadores de miles de puntos.
  const formatted = Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `$${formatted}`;
};
