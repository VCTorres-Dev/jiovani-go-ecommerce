import { useState, useEffect } from 'react';

// Hook personalizado para "debounce".
// Retrasa la actualización de un valor hasta que ha pasado un tiempo determinado sin que cambie.
// Esto es útil para evitar peticiones de API excesivas en campos de búsqueda.
function useDebounce(value, delay) {
  // Estado para guardar el valor "debounced"
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configura un temporizador para actualizar el valor debounced después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpia el temporizador si el valor cambia (o si el componente se desmonta)
    // Esto evita que el valor se actualice si el usuario sigue escribiendo.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se vuelve a ejecutar si el valor o el delay cambian

  return debouncedValue;
}

export default useDebounce;
