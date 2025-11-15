const Message = require('../models/Message');

// @desc    Crear un nuevo mensaje de contacto
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, asunto, mensaje } = req.body;

    // Validación básica de campos requeridos
    if (!nombre || !email || !asunto || !mensaje) {
      return res.status(400).json({ message: 'Por favor, completa todos los campos requeridos.' });
    }

    const newMessage = new Message({
      nombre,
      apellido,
      email,
      telefono,
      asunto,
      mensaje,
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({
      message: 'Mensaje enviado con éxito. Gracias por contactarnos.',
      data: savedMessage,
    });
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    // Manejo de errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos.', errors: error.errors });
    }
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Obtener todos los mensajes
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    // Filtros y paginación (ejemplo básico)
    const { status } = req.query;
    const filter = {};
    if (status === 'unread') filter.leido = false;
    if (status === 'read') filter.leido = true;

    const messages = await Message.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Obtener un mensaje por ID
// @route   GET /api/messages/:id
// @access  Private/Admin
const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado.' });
    }
    res.json(message);
  } catch (error) {
    console.error(`Error al obtener mensaje ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Actualizar un mensaje (ej. marcar como leído)
// @route   PUT /api/messages/:id
// @access  Private/Admin
const updateMessage = async (req, res) => {
  try {
    const { leido, respondido, notasAdmin } = req.body;
    const updateData = {};

    if (typeof leido === 'boolean') updateData.leido = leido;
    if (typeof respondido === 'boolean') {
      updateData.respondido = respondido;
      if (respondido) updateData.fechaRespuesta = new Date();
    }
    if (notasAdmin !== undefined) updateData.notasAdmin = notasAdmin;

    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Mensaje no encontrado.' });
    }

    res.json(updatedMessage);
  } catch (error) {
    console.error(`Error al actualizar mensaje ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Eliminar un mensaje
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado.' });
    }

    await message.deleteOne(); // Usar deleteOne() en lugar de remove()
    res.json({ message: 'Mensaje eliminado correctamente.' });
  } catch (error) {
    console.error(`Error al eliminar mensaje ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
};
