const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { auth } = require("../middleware/authMiddleware"); // Para rutas protegidas

// Enviar nuevo mensaje de contacto (público)
router.post("/", async (req, res) => {
  try {
    const { nombre, email, telefono, asunto, mensaje } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !asunto || !mensaje) {
      return res.status(400).json({
        message: "Los campos nombre, email, asunto y mensaje son obligatorios",
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "El formato del email no es válido",
      });
    }

    // Determinar prioridad basada en el asunto
    let prioridad = "media";
    if (asunto === "reclamo") {
      prioridad = "alta";
    } else if (asunto === "asesoramiento" || asunto === "consulta-producto") {
      prioridad = "media";
    } else {
      prioridad = "baja";
    }

    const nuevoMensaje = new Message({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono ? telefono.trim() : "",
      asunto,
      mensaje: mensaje.trim(),
      prioridad,
    });

    await nuevoMensaje.save();

    res.status(201).json({
      message: "Mensaje enviado exitosamente",
      id: nuevoMensaje._id,
    });
  } catch (error) {
    console.error("Error al guardar mensaje:", error);
    res.status(500).json({
      message: "Error interno del servidor al enviar el mensaje",
    });
  }
});

// Obtener todos los mensajes (solo administradores)
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, leido, asunto, prioridad } = req.query;

    // Construir filtros
    const filtros = {};
    if (leido !== undefined) filtros.leido = leido === "true";
    if (asunto) filtros.asunto = asunto;
    if (prioridad) filtros.prioridad = prioridad;

    const opciones = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { fechaEnvio: -1 }, // Más recientes primero
    };

    const mensajes = await Message.find(filtros)
      .sort(opciones.sort)
      .limit(opciones.limit * 1)
      .skip((opciones.page - 1) * opciones.limit);

    const total = await Message.countDocuments(filtros);

    res.json({
      mensajes,
      totalPaginas: Math.ceil(total / opciones.limit),
      paginaActual: opciones.page,
      total,
    });
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    res.status(500).json({
      message: "Error al obtener los mensajes",
    });
  }
});

// Obtener un mensaje específico (solo administradores)
router.get("/:id", auth, async (req, res) => {
  try {
    const mensaje = await Message.findById(req.params.id);

    if (!mensaje) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }

    res.json(mensaje);
  } catch (error) {
    console.error("Error al obtener mensaje:", error);
    res.status(500).json({ message: "Error al obtener el mensaje" });
  }
});

// Marcar mensaje como leído (solo administradores)
router.patch("/:id/leido", auth, async (req, res) => {
  try {
    const { leido = true } = req.body;

    const mensaje = await Message.findByIdAndUpdate(
      req.params.id,
      { leido },
      { new: true }
    );

    if (!mensaje) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }

    res.json({
      message: `Mensaje marcado como ${leido ? "leído" : "no leído"}`,
      mensaje,
    });
  } catch (error) {
    console.error("Error al actualizar mensaje:", error);
    res.status(500).json({ message: "Error al actualizar el mensaje" });
  }
});

// Marcar mensaje como respondido (solo administradores)
router.patch("/:id/respondido", auth, async (req, res) => {
  try {
    const { respondido = true } = req.body;

    const mensaje = await Message.findByIdAndUpdate(
      req.params.id,
      {
        respondido,
        leido: true, // Al responder, automáticamente se marca como leído
      },
      { new: true }
    );

    if (!mensaje) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }

    res.json({
      message: `Mensaje marcado como ${
        respondido ? "respondido" : "no respondido"
      }`,
      mensaje,
    });
  } catch (error) {
    console.error("Error al actualizar mensaje:", error);
    res.status(500).json({ message: "Error al actualizar el mensaje" });
  }
});

// Eliminar mensaje (solo administradores)
router.delete("/:id", auth, async (req, res) => {
  try {
    const mensaje = await Message.findByIdAndDelete(req.params.id);

    if (!mensaje) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }

    res.json({ message: "Mensaje eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar mensaje:", error);
    res.status(500).json({ message: "Error al eliminar el mensaje" });
  }
});

// Estadísticas de mensajes (solo administradores)
router.get("/stats/resumen", auth, async (req, res) => {
  try {
    const estadisticas = await Message.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          noLeidos: { $sum: { $cond: [{ $eq: ["$leido", false] }, 1, 0] } },
          noRespondidos: {
            $sum: { $cond: [{ $eq: ["$respondido", false] }, 1, 0] },
          },
          prioridadAlta: {
            $sum: { $cond: [{ $eq: ["$prioridad", "alta"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          noLeidos: 1,
          noRespondidos: 1,
          prioridadAlta: 1,
          porcentajeLeidos: {
            $multiply: [
              { $divide: [{ $subtract: ["$total", "$noLeidos"] }, "$total"] },
              100,
            ],
          },
          porcentajeRespondidos: {
            $multiply: [
              {
                $divide: [
                  { $subtract: ["$total", "$noRespondidos"] },
                  "$total",
                ],
              },
              100,
            ],
          },
        },
      },
    ]);

    const stats = estadisticas[0] || {
      total: 0,
      noLeidos: 0,
      noRespondidos: 0,
      prioridadAlta: 0,
      porcentajeLeidos: 0,
      porcentajeRespondidos: 0,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
});

module.exports = router;
