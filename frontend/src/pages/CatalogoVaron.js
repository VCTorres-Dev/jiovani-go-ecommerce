import React from 'react';
import CatalogoPage from './CatalogoPage';

const CatalogoVaron = () => {
  // Este componente actúa como un 'wrapper' para el componente reutilizable CatalogoPage,
  // especificando el género para los productos de varón.
  return <CatalogoPage gender="varon" title="Catálogo de Varones" />;
};

export default CatalogoVaron;
