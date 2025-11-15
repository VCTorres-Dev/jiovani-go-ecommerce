// utils.js
export const formatPrice = (price) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "CLP",
  }).format(price);
};
