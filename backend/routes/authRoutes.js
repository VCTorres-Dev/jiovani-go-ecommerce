const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
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
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Por favor, introduce todos los campos." });
  }

  try {
    // Check for user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

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
        if (err) {
          throw err;
        }
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
    console.error(err.message);
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
    
    // Log temporal para diagnosticar el rol
    console.log(`[AUTH/USER] Usuario: ${user.username}, Rol en BD: ${user.role}`);
    
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
