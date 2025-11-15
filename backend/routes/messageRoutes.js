const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} = require('../controllers/messageController');
const { auth, adminAuth: admin } = require('../middleware/authMiddleware');

// @route   POST /api/messages
// @desc    Crear un nuevo mensaje (público)
router.post('/', createMessage);

// @route   GET /api/messages
// @desc    Obtener todos los mensajes (solo admin)
router.get('/', auth, admin, getMessages);

// @route   GET /api/messages/:id
// @desc    Obtener un mensaje por ID (solo admin)
router.get('/:id', auth, admin, getMessageById);

// @route   PUT /api/messages/:id
// @desc    Actualizar un mensaje (solo admin)
router.put('/:id', auth, admin, updateMessage);

// @route   DELETE /api/messages/:id
// @desc    Eliminar un mensaje (solo admin)
router.delete('/:id', auth, admin, deleteMessage);

module.exports = router;
