const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  console.log('====================================');
  console.log('[AUTH MIDDLEWARE] 🔐 Verificando autenticación');
  console.log('[AUTH MIDDLEWARE] 📍 Endpoint:', req.method, req.originalUrl);
  console.log('====================================');

  const authHeader = req.header("Authorization");

  console.log('[AUTH MIDDLEWARE] 🔍 Header Authorization recibido?', !!authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('[AUTH MIDDLEWARE] ❌ NO hay header Authorization válido');
    console.log('[AUTH MIDDLEWARE] 📛 authHeader:', authHeader ? `Existe pero no empieza con "Bearer "` : 'No existe');
    return res.status(401).json({ message: "Acceso denegado. No se proporcionó un token válido." });
  }

  const token = authHeader.substring(7, authHeader.length);
  console.log('[AUTH MIDDLEWARE] ✅ Token extraído del header:', token.substring(0, 20) + '...');

  try {
    console.log('[AUTH MIDDLEWARE] 🔓 Verificando token con JWT...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('[AUTH MIDDLEWARE] ✅ Token JWT verificado exitosamente');
    console.log('[AUTH MIDDLEWARE] 📦 Payload decodificado:', JSON.stringify(decoded, null, 2));

    // Soportar ambos formatos de token: { user: { id, ... } } y { id, ... }
    const userId = decoded?.user?.id || decoded?.id || decoded?._id;
    console.log('[AUTH MIDDLEWARE] 🔍 User ID extraído:', userId);

    console.log('[AUTH MIDDLEWARE] 🔎 Buscando usuario en BD...');
    const user = await User.findById(userId).select("-password");

    if (!user) {
      console.log('[AUTH MIDDLEWARE] ❌ Usuario NO encontrado en BD para ID:', userId);
      return res.status(401).json({ message: "Token inválido. Usuario no encontrado." });
    }

    console.log('[AUTH MIDDLEWARE] ✅ Usuario encontrado en BD:', {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    req.user = user; // Adjuntar el objeto de usuario completo a la solicitud
    console.log('[AUTH MIDDLEWARE] ✅ req.user establecido, pasando al siguiente middleware');
    console.log('====================================\n');
    next();
  } catch (error) {
    console.log('[AUTH MIDDLEWARE] ❌ ERROR al verificar token');
    console.log('[AUTH MIDDLEWARE] 📛 Error type:', error.name);
    console.log('[AUTH MIDDLEWARE] 📛 Error message:', error.message);

    if (error.name === 'JsonWebTokenError') {
        console.log('[AUTH MIDDLEWARE] 🚫 JWT inválido (malformado o firma incorrecta)');
        return res.status(401).json({ message: "Token inválido." });
    } else if (error.name === 'TokenExpiredError') {
        console.log('[AUTH MIDDLEWARE] ⏰ JWT expirado');
        return res.status(401).json({ message: "El token ha expirado. Por favor, inicia sesión de nuevo." });
    } else {
        console.error('[AUTH MIDDLEWARE] 📛 Error inesperado:', error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
  }
};

const adminAuth = (req, res, next) => {
  // Verificar que el middleware 'auth' ya fue ejecutado y adjuntó req.user
  if (!req.user) {
    return res.status(401).json({ message: "Acceso denegado. No se proporcionó un token válido." });
  }

  // Verificar que el usuario tiene rol admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador.' 
    });
  }

  next();
};

module.exports = { auth, adminAuth };
