const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { WebpayPlus } = require("transbank-sdk");

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

// TEST ENDPOINT - Transbank WebPay Plus REAL (usando SDK oficial)
app.post("/api/payments/init-test", (req, res) => {
  try {
    console.log('🚀 [TRANSBANK INIT] Iniciando transacción Transbank WebPay Plus...');
    console.log('📥 Body recibido:', JSON.stringify(req.body, null, 2));
    
    const { amount, buyOrder, sessionId, returnUrl, userEmail } = req.body;
    
    // Validación
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount inválido' 
      });
    }
    
    if (!buyOrder) {
      return res.status(400).json({ 
        success: false, 
        message: 'buyOrder es requerido' 
      });
    }
    
    if (!returnUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'returnUrl es requerido' 
      });
    }
    
    // Configurar Transbank WebPay Plus
    // La SDK trae preconfiguradas las credenciales de TESTING
    // Para PRODUCCIÓN, se configuraría con credenciales reales
    const txn = new WebpayPlus.Transaction({
      apiKey: process.env.TRANSBANK_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
      commerceCode: process.env.TRANSBANK_COMMERCE_CODE || '597055555532',
      environment: (process.env.TRANSBANK_ENV === 'PRODUCTION') ? 'LIVE' : 'INTEGRATION'
    });
    
    // Crear transacción
    txn.create(
      buyOrder,
      sessionId || Date.now().toString(),
      amount,
      returnUrl
    ).then(response => {
      console.log('✅ [TRANSBANK] Transacción creada exitosamente');
      console.log('📊 Response:', JSON.stringify(response, null, 2));
      
      // Devolver la URL y token real de Transbank
      res.json({
        success: true,
        message: 'Transacción iniciada correctamente con Transbank',
        data: {
          url: response.url,
          token: response.token,
          transactionId: buyOrder,
          userEmail: userEmail,
          amount: amount,
          environment: (process.env.TRANSBANK_ENV === 'PRODUCTION') ? 'production' : 'integration'
        }
      });
    }).catch(error => {
      console.error('❌ [TRANSBANK] Error creando transacción:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error iniciando transacción Transbank',
        error: error.message 
      });
    });
    
  } catch (error) {
    console.error('❌ [TRANSBANK INIT] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en endpoint de pago',
      error: error.message 
    });
  }
});

// CONFIRMATION ENDPOINT - Confirmar pago después que usuario retorna de Transbank
app.post("/api/payments/confirm", (req, res) => {
  try {
    console.log('🔐 [TRANSBANK CONFIRM] Confirmando transacción...');
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token es requerido'
      });
    }
    
    const txn = new WebpayPlus.Transaction({
      apiKey: process.env.TRANSBANK_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
      commerceCode: process.env.TRANSBANK_COMMERCE_CODE || '597055555532',
      environment: (process.env.TRANSBANK_ENV === 'PRODUCTION') ? 'LIVE' : 'INTEGRATION'
    });
    
    // Confirmar la transacción con Transbank
    txn.commit(token).then(response => {
      console.log('✅ [TRANSBANK CONFIRM] Pago confirmado');
      console.log('📊 Response:', JSON.stringify(response, null, 2));
      
      // Aquí podrías guardar en BD, actualizar orden, etc
      res.json({
        success: true,
        message: 'Pago confirmado exitosamente',
        data: {
          transactionId: response.buy_order,
          accountingDate: response.accounting_date,
          transactionDate: response.transaction_date,
          vci: response.vci,
          status: response.status,
          amount: response.amount
        }
      });
    }).catch(error => {
      console.error('❌ [TRANSBANK CONFIRM] Error confirmando:', error);
      res.status(400).json({
        success: false,
        message: 'Error confirmando transacción',
        error: error.message
      });
    });
    
  } catch (error) {
    console.error('❌ [TRANSBANK CONFIRM] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en confirmación',
      error: error.message
    });
  }
});

// Importar y usar rutas
try {
  // TEMPORAL: Comentar authRoutes porque requiere bcryptjs que aún está en issues de instalación
  // const authRoutes = require("./routes/authRoutes");
  
  const productRoutes = require("./routes/productRoutes");
  const analyticsRoutes = require("./routes/analyticsRoutes"); 
  const orderRoutes = require("./routes/orderRoutes"); 
  const messageRoutes = require('./routes/messageRoutes'); 
  const paymentRoutes = require('./routes/paymentRoutes');
  const userRoutes = require("./routes/userRoutes");

  // app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/analytics", analyticsRoutes); 
  app.use("/api/orders", orderRoutes); 
  app.use("/api/messages", messageRoutes); 
  app.use("/api/payments", paymentRoutes);
  app.use("/api/users", userRoutes);
  console.log("✅ Todas las rutas cargadas exitosamente (authRoutes temporalmente deshabilitada)");
} catch (error) {
  console.warn("⚠️ No se pudieron cargar algunas rutas:", error.message);
  console.log("💡 Las rutas pueden no estar disponibles en este ambiente");
} 

// Manejo de errores 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}`);
});
