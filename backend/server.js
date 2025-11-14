const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// En production (Railway), las variables de entorno ya están disponibles
// En desarrollo local, crear archivo .env manualmente
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Middleware
const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:3001", 
  "http://127.0.0.1:3000", 
  "http://127.0.0.1:3001", 
  "http://localhost:5000", 
  "http://192.168.56.1:3000",
  "http://192.168.56.1:3001"
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones sin 'origin' (como las de Postman o apps móviles) o si el origen está en la lista blanca
    console.log('[CORS DEBUG] Origin received:', origin);
    const normalized = origin ? origin.replace(/\/$/, '') : origin;
    if (!origin || allowedOrigins.includes(normalized)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  optionsSuccessStatus: 200, // Para navegadores antiguos
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public")); // Servir archivos estáticos desde la carpeta 'public'

// TRACER: Middleware para registrar todas las solicitudes entrantes
app.use((req, res, next) => {
  console.log(
    `[INCOMING REQUEST] ${new Date().toISOString()} - ${req.method} ${
      req.originalUrl
    }`
  );
  next();
});

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dejoaromas", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado exitosamente"))
  .catch((err) => console.log("Error conectando a MongoDB:", err));

// Rutas básicas
app.get("/", (req, res) => {
  res.json({ message: "API de Jiovanni Go funcionando correctamente" });
});

// TEST ENDPOINT - Para testing de Transbank SIN depender de paymentRoutes
app.post("/api/payments/init-test", (req, res) => {
  try {
    console.log('🚀 [TEST ENDPOINT] Iniciando pago de prueba...');
    console.log('📥 Body recibido:', JSON.stringify(req.body, null, 2));
    
    const { amount, buyOrder, sessionId, returnUrl, userEmail } = req.body;
    
    // Validación básica
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount inválido' 
      });
    }
    
    // Para testing, devolvemos URL mock de Transbank
    const mockTransbankUrl = "https://webpay3g.transbank.cl/initTransaction?wpm_token=test_token_123456";
    
    res.json({
      success: true,
      message: 'Transacción iniciada correctamente (TEST)',
      data: {
        url: mockTransbankUrl,
        token: "test_token_123456",
        transactionId: Date.now().toString(),
        userEmail: userEmail,
        amount: amount
      }
    });
  } catch (error) {
    console.error('❌ [TEST ENDPOINT] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en endpoint de test',
      error: error.message 
    });
  }
});

// Importar y usar rutas
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes"); 
const orderRoutes = require("./routes/orderRoutes"); 
const messageRoutes = require('./routes/messageRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes'); // Nueva ruta de pagos

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/analytics", analyticsRoutes); 
app.use("/api/orders", orderRoutes); 
app.use("/api/messages", messageRoutes); 
app.use("/api/payments", paymentRoutes); // Registrar rutas de pago
app.use("/api/users", require("./routes/userRoutes")); 

// Manejo de errores 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}`);
});
