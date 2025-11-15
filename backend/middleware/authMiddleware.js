const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  console.log(`[TRACE] authMiddleware se está ejecutando para la ruta: ${req.originalUrl}`);
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Acceso denegado. No se proporcionó un token válido." });
  }

  const token = authHeader.substring(7, authHeader.length);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Token inválido. Usuario no encontrado." });
    }

    req.user = user; // Adjuntar el objeto de usuario completo a la solicitud
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Token inválido." });
    } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "El token ha expirado. Por favor, inicia sesión de nuevo." });
    } else {
        console.error("Error en el middleware de autenticación:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
  }
};

const adminAuth = async (req, res, next) => {
  // Primero autenticar
  await auth(req, res, () => {
    // Luego verificar rol admin
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        message: 'Acceso denegado. Se requiere rol de administrador.' 
      });
    }
  });
};

module.exports = { auth, adminAuth };
