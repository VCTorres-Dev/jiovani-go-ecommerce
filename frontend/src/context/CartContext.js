import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product) => {
    console.log('🛒 === DIAGNÓSTICO DE ADDTOCART ===');
    console.log('📦 Producto recibido:', product);
    console.log('🖼️ imageURL:', product.imageURL);
    console.log('🖼️ imageUrl (minúscula):', product.imageUrl);
    console.log('🖼️ image:', product.image);
    console.log('🔍 Todas las propiedades del producto:', Object.keys(product));
    console.log('🛒 === FIN DIAGNÓSTICO ===');
    
    setCartItems(currentItems => {
      const itemExists = currentItems.find(item => item._id === product._id);
      if (itemExists) {
        return currentItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Asegurar que todas las propiedades se preserven
        const newItem = { 
          ...product, 
          quantity: 1,
          // Asegurar que imageURL esté presente - MÚLTIPLES FALLBACKS
          imageURL: product.imageURL || product.imageUrl || product.image || null
        };
        console.log('🆕 Nuevo item agregado al carrito:', newItem);
        console.log('🖼️ imageURL final del item:', newItem.imageURL);
        return [...currentItems, newItem];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const decrementFromCart = (productId) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item._id === productId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter(item => item.quantity > 0); // Remove item if quantity is 0
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const value = {
    cartItems,
    addToCart,
    decrementFromCart,
    removeFromCart,
    clearCart,
    isCartOpen,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
