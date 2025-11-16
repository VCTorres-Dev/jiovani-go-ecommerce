const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // AÑADIDO

console.log('[TRACE] authRoutes.js cargado.'); // Para confirmar que el archivo se carga

router.use((req, res, next) => {
    console.log(`[TRACE] Petición recibida en authRoutes: ${req.method} ${req.path}`);
    next();
});
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/authMiddleware");

// Middleware para verificar conexión a MongoDB
const requireMongoDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Base de datos no disponible. Intenta nuevamente en unos segundos."
    });
  }
  next();
};

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", requireMongoDB, async (req, res) => {
    console.log('[TRACE] Accediendo a la ruta /register.');
  console.log('[TRACE] Request body:', req.body);
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Por favor, introduce todos los campos." });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
    });

    // The password will be hashed by the 'pre-save' hook in the User model.
    await user.save();

    // Create JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' }, // Expires in 30 days
      (err, token) => {
        if (err) throw err;
        res.json({ 
          success: true,
          message: "Usuario registrado exitosamente",
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", requireMongoDB, async (req, res) => {
  console.log('[TRACE] Accediendo a la ruta /login.');
  console.log('[TRACE] Request body:', req.body);
  console.log('[TRACE] Request headers:', req.headers);
  
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    console.log('[TRACE] Faltan campos requeridos');
    return res.status(400).json({ message: "Por favor, introduce todos los campos." });
  }

  try {
    console.log('[TRACE] Buscando usuario con email:', email);
    // Check for user
    let user = await User.findOne({ email });
    if (!user) {
      console.log('[TRACE] Usuario no encontrado');
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    console.log('[TRACE] Usuario encontrado, verificando contraseña');
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('[TRACE] Contraseña incorrecta');
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    console.log('[TRACE] Contraseña correcta, generando JWT');
    // Create JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
    };

    console.log('[TRACE] Payload para JWT:', payload);
    console.log('[TRACE] JWT_SECRET existe:', !!process.env.JWT_SECRET);

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' }, // Expires in 30 days
      (err, token) => {
        if (err) {
          console.log('[TRACE] Error generando JWT:', err);
          throw err;
        }
        console.log('[TRACE] JWT generado exitosamente');
        console.log('[TRACE] Enviando respuesta con token y usuario');
        res.json({
          success: true,
          message: "Login exitoso",
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error('[TRACE] Error en login:', err.message);
    res.status(500).send("Error del servidor");
  }
});

// @route   GET api/auth/user
// @desc    Get user data from token
// @access  Private
router.get('/user', auth, requireMongoDB, async (req, res) => {
  try {
    // req.user is attached by the auth middleware, which has the user's id
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Usuario no encontrado.' 
        });
    }
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

module.exports = router;
