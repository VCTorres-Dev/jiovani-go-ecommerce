const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      imageURL: {
        type: String,
        required: false,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'shipped', 'delivered', 'cancelled', 'completed', 'failed'],
    default: 'pending',
  },
  // Información de seguimiento
  trackingCode: {
    type: String,
  },
  carrier: {
    type: String,
    default: 'Correos de Chile'
  },
  estimatedDelivery: {
    type: String,
  },
  preparingDate: {
    type: Date,
  },
  shippedDate: {
    type: Date,
  },
  deliveredDate: {
    type: Date,
  },
  // Información específica de Transbank
  transbank: {
    buyOrder: {
      type: String,
      unique: true,
      sparse: true // Permite null/undefined pero únicos cuando están presentes
    },
    sessionId: {
      type: String,
    },
    token: {
      type: String,
    },
    transactionDate: {
      type: Date,
    },
    authorizationCode: {
      type: String,
    },
    paymentTypeCode: {
      type: String,
    },
    responseCode: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    installmentsNumber: {
      type: Number,
    },
    cardNumber: {
      type: String,
    },
    // Campos adicionales para auditoría completa
    status: {
      type: String, // AUTHORIZED, FAILED, etc.
    },
    vci: {
      type: String, // Verification Code Indicator
    },
    accountingDate: {
      type: String, // Fecha contable
    },
    balance: {
      type: Number, // Saldo restante (tarjetas prepago)
    },
    // Control de estados especiales
    cancelledByUser: {
      type: Boolean,
      default: false
    },
    timeoutExpired: {
      type: Boolean,
      default: false
    },
    commitAttempts: {
      type: Number,
      default: 0
    },
    lastCommitAttempt: {
      type: Date
    },
    // Información de reversa/anulación
    refunded: {
      type: Boolean,
      default: false
    },
    refundDate: {
      type: Date
    },
    refundAmount: {
      type: Number
    },
    refundType: {
      type: String, // 'REVERSA' o 'ANULACION'
    }
  },
  // Información de contacto y envío
  shippingInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    }
  },
  // Metadatos adicionales
  paymentMethod: {
    type: String,
    enum: ['transbank', 'transfer', 'cash'],
    default: 'transbank'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Esto agregará createdAt y updatedAt automáticamente
});

// Índices para optimizar consultas
orderSchema.index({ 'transbank.buyOrder': 1 });
orderSchema.index({ 'transbank.token': 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// Método para generar buy order único (máximo 26 caracteres para Transbank)
orderSchema.statics.generateBuyOrder = function(userId) {
  // Usar timestamp corto + hash del userId
  const timestamp = Date.now().toString().slice(-8); // Últimos 8 dígitos del timestamp
  const userHash = userId.toString().slice(-6); // Últimos 6 caracteres del userId
  const random = Math.random().toString(36).substr(2, 6); // 6 caracteres aleatorios
  return `ORD${timestamp}${userHash}${random}`.toUpperCase(); // Total: 3+8+6+6 = 23 caracteres
};

// Método para generar session ID único (máximo 61 caracteres para Transbank)
orderSchema.statics.generateSessionId = function() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 15);
  return `SES_${timestamp}_${random}`;
};

// Método para verificar si el pago fue exitoso
orderSchema.methods.isPaymentSuccessful = function() {
  return this.transbank && this.transbank.responseCode === 0;
};

// Método para obtener el estado legible del pago
orderSchema.methods.getPaymentStatusText = function() {
  switch (this.status) {
    case 'pending':
      return 'Pendiente';
    case 'preparing':
      return 'Preparando';
    case 'shipped':
      return 'Enviado';
    case 'delivered':
      return 'Entregado';
    case 'failed':
      return 'Fallido';
    case 'cancelled':
      return 'Cancelado';
    case 'completed':
      return 'Completado';
    default:
      return 'Desconocido';
  }
};

module.exports = mongoose.model('Order', orderSchema);
