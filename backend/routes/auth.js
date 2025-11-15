// Este archivo está obsoleto y ha sido neutralizado.
// La lógica de autenticación ha sido movida a /middleware/authMiddleware.js
// y las rutas de autenticación a /routes/authRoutes.js.

module.exports = (req, res, next) => {
    // No hacer nada y pasar a la siguiente ruta.
    next();
};
