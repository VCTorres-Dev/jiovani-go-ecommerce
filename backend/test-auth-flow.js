// Script para diagnosticar exactamente qué está pasando con GET /api/users
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const app = express();
const PORT = 5001; // Puerto diferente para no conflictuar

app.use(express.json());

// Middleware de CORS
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://jiovannigo.netlify.app'],
  credentials: true
}));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dejoaromas', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// Middleware de autenticación idéntico al de producción
const auth = async (req, res, next) => {
  console.log('[TEST AUTH] Headers recibidos:', req.headers);
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('[TEST AUTH] NO hay Authorization header válido');
    return res.status(401).json({ message: "Acceso denegado. No se proporcionó un token válido." });
  }

  const token = authHeader.substring(7, authHeader.length);
  console.log('[TEST AUTH] Token extraído:', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[TEST AUTH] Token decodificado:', decoded);
    
    const userId = decoded?.user?.id || decoded?.id || decoded?._id;
    console.log('[TEST AUTH] UserId extraído:', userId);
    
    const user = await User.findById(userId).select("-password");
    console.log('[TEST AUTH] Usuario encontrado en BD:', user ? { username: user.username, role: user.role } : 'NO ENCONTRADO');

    if (!user) {
      return res.status(401).json({ message: "Token inválido. Usuario no encontrado." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[TEST AUTH] Error en auth:', error.message);
    return res.status(401).json({ message: "Token inválido." });
  }
};

const adminAuth = (req, res, next) => {
  console.log('[TEST ADMIN AUTH] Verificando admin. req.user:', req.user ? { username: req.user.username, role: req.user.role } : 'NO EXISTE');
  
  if (!req.user) {
    console.log('[TEST ADMIN AUTH] NO hay req.user');
    return res.status(401).json({ message: "Acceso denegado. No hay usuario." });
  }

  if (req.user.role !== 'admin') {
    console.log('[TEST ADMIN AUTH] Usuario NO es admin. Rol:', req.user.role);
    return res.status(403).json({ 
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador.' 
    });
  }

  console.log('[TEST ADMIN AUTH] ✅ Usuario ES admin');
  next();
};

// Ruta de prueba idéntica a /api/users
app.get('/test-users', [auth, adminAuth], async (req, res) => {
  try {
    console.log('[TEST ROUTE] GET /test-users ejecutada');
    const users = await User.find().select('-password').limit(10);
    res.json({ success: true, users: users.length, data: users.map(u => ({ username: u.username, role: u.role })) });
  } catch (err) {
    console.error('[TEST ROUTE] Error:', err.message);
    res.status(500).json({ message: `Server Error: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`\n[TEST SERVER] Servidor de prueba ejecutándose en puerto ${PORT}`);
  console.log(`[TEST SERVER] Para probar, usa:\n`);
  console.log(`  curl -H "Authorization: Bearer <TOKEN>" http://localhost:${PORT}/test-users\n`);
});
