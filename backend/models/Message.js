const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    asunto: {
      type: String,
      required: true,
      enum: [
        "consulta-producto",
        "informacion-compra",
        "asesoramiento",
        "reclamo",
        "otro",
      ],
    },
    mensaje: {
      type: String,
      required: true,
      trim: true,
    },
    fechaEnvio: {
      type: Date,
      default: Date.now,
    },
    leido: {
      type: Boolean,
      default: false,
    },
    respondido: {
      type: Boolean,
      default: false,
    },
    fechaRespuesta: {
      type: Date,
    },
    notasAdmin: {
      type: String,
      trim: true,
    },
    prioridad: {
      type: String,
      enum: ["baja", "media", "alta"],
      default: "media",
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas eficientes
MessageSchema.index({ fechaEnvio: -1 });
MessageSchema.index({ leido: 1 });
MessageSchema.index({ asunto: 1 });

module.exports = mongoose.model("Message", MessageSchema);
