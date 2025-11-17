const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const https = require("https");
const querystring = require("querystring");

// En production (Railway), las variables de entorno ya están disponibles
// En desarrollo local, crear archivo .env manualmente
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:3001", 
  "http://127.0.0.1:3000", 
  "http://127.0.0.1:3001", 
  "http://localhost:5000", 
  "http://192.168.56.1:3000",
  "http://192.168.56.1:3001",
  "https://jiovannigo.netlify.app" // Frontend en Netlify
];

// Agregar URLs de variables de entorno si existen
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
if (process.env.FRONTEND_URL_REAL) {
  allowedOrigins.push(process.env.FRONTEND_URL_REAL);
}

const corsOptions = {
  origin: (origin, callback) => {
    const normalized = origin ? origin.replace(/\/$/, '') : origin;
    if (!origin || allowedOrigins.includes(normalized)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

// Conectar a MongoDB
let mongoConnected = false;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dejoaromas", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB conectado exitosamente");
    mongoConnected = true;
  } catch (err) {
    console.log("Advertencia: MongoDB no disponible:", err.message);
    mongoConnected = false;
  }
};

// Iniciar conexion
connectMongoDB();

// Rutas basicas
app.get("/", (req, res) => {
  res.json({ message: "API de Jiovanni Go funcionando correctamente" });
});

// MOCK ENDPOINT - Para testing SIN credenciales reales
app.post("/api/payments/init-mock", (req, res) => {
  try {
    console.log('[MOCK TRANSBANK] Iniciando transaccion MOCK...');
    console.log('Body recibido:', JSON.stringify(req.body, null, 2));
    
    const { amount, buyOrder, sessionId, returnUrl, userEmail } = req.body;
    
    // Validacion
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount invalido',
        received: amount
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
    
    // Generar token MOCK (formato similar a Transbank real)
    const mockToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    
    const host = 'webpay3gint.transbank.cl'; // TEST environment
    const redirectUrl = `https://${host}/webpay/v1.3/${mockToken}`;
    
    console.log('[MOCK] Token generado:', mockToken);
    console.log('[MOCK] Redirect URL:', redirectUrl);
    
    // Responder con formato identico a Transbank REAL
    res.json({
      success: true,
      message: 'Transaccion iniciada correctamente (MOCK)',
      data: {
        url: redirectUrl,
        token: mockToken,
        transactionId: buyOrder,
        userEmail: userEmail,
        amount: amount,
        environment: 'mock-integration'
      }
    });
    
  } catch (error) {
    console.error('[MOCK] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en endpoint MOCK de pago',
      error: error.message 
    });
  }
});

// MOCK CONFIRM ENDPOINT
app.post("/api/payments/confirm-mock", (req, res) => {
  try {
    console.log('[MOCK CONFIRM] Confirmando transaccion MOCK...');
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token es requerido'
      });
    }
    
    console.log('[MOCK CONFIRM] Token validado:', token);
    
    // Simular respuesta real de Transbank
    res.json({
      success: true,
      message: 'Pago confirmado exitosamente (MOCK)',
      data: {
        accountingDate: new Date().toISOString().split('T')[0],
        transactionDate: new Date().toISOString(),
        vci: 'TSY',
        status: 'AUTHORIZED',
        amount: 10000,
        buyOrder: 'order-test-123',
        cardNumber: '****6623',
        authorizationCode: 'MOCKAUTH123456',
        responseCode: '0',
        responseDescription: 'Transaccion autorizada',
        token: token,
        isMock: true
      }
    });
    
  } catch (error) {
    console.error('[MOCK CONFIRM] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirmando pago MOCK',
      error: error.message
    });
  }
});

// CONFIRMATION ENDPOINT - Confirmar pago después que usuario retorna de Transbank
app.post("/api/payments/confirm", (req, res) => {
  try {
    console.log('[TRANSBANK CONFIRM] Confirmando transaccion...');
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token es requerido'
      });
    }
    
    // Credenciales Transbank
    const commerceCode = process.env.TRANSBANK_COMMERCE_CODE || '597055555532';
    const apiKey = process.env.TRANSBANK_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
    const isProduction = process.env.TRANSBANK_ENV === 'PRODUCTION';
    const host = isProduction ? 'webpay3g.transbank.cl' : 'webpay3gint.transbank.cl';
    
    // Body para Transbank API
    const body = JSON.stringify({
      token_ws: token
    });
    
    // Opciones del request HTTPS
    const options = {
      hostname: host,
      path: '/rswebpay/api/webpay/v1.2/transactions/confirm',
      method: 'POST',
      headers: {
        'Tbk-Api-Key-Id': commerceCode,
        'Tbk-Api-Key-Secret': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    
    // Request a Transbank
    const request = https.request(options, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (response.statusCode === 200) {
            console.log('[TRANSBANK CONFIRM] Pago confirmado');
            
            res.json({
              success: true,
              message: 'Pago confirmado exitosamente',
              data: {
                transactionId: result.buy_order,
                accountingDate: result.accounting_date,
                transactionDate: result.transaction_date,
                vci: result.vci,
                status: result.status,
                amount: result.amount,
                cardNumber: result.card_detail?.card_number
              }
            });
          } else {
            console.error('[TRANSBANK CONFIRM] Error:', result);
            res.status(response.statusCode).json({
              success: false,
              message: 'Error confirmando transaccion',
              error: result.detail || result.message
            });
          }
        } catch (parseError) {
          console.error('[TRANSBANK CONFIRM] Error parsing response:', parseError);
          res.status(500).json({
            success: false,
            message: 'Error procesando respuesta de Transbank',
            error: parseError.message
          });
        }
      });
    });
    
    request.on('error', (error) => {
      console.error('[TRANSBANK CONFIRM] Error en request:', error);
      res.status(500).json({
        success: false,
        message: 'Error comunicandose con Transbank',
        error: error.message
      });
    });
    
    request.write(body);
    request.end();
    
  } catch (error) {
    console.error('[TRANSBANK CONFIRM] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en confirmacion',
      error: error.message
    });
  }
});

// ============================================================
// MIDDLEWARE: Validar que MongoDB esté conectado
// ============================================================
const requireMongoDB = (req, res, next) => {
  if (!mongoConnected || mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Base de datos no disponible. Intenta nuevamente en unos segundos."
    });
  }
  next();
};

// ============================================================
// PRODUCTOS REALES DEL USUARIO (desde MongoDB)
// ============================================================
const Product = require('./models/Product');

// Endpoint: Productos desde MongoDB
app.get("/api/products", requireMongoDB, async (req, res) => {
  try {
    const { gender, page = 1, limit = 1000, search = '' } = req.query;
    
    // Construir query MongoDB
    const query = {};
    
    // Filtrar por genero (case-insensitive)
    if (gender && gender !== 'undefined' && gender !== '') {
      query.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
    }
    
    // Filtrar por busqueda
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);
    
    const products = await Product.find(query)
      .sort({ name: 1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);
    
    console.log(`[PRODUCTS] Devolviendo ${products.length} productos desde MongoDB`);
    
    res.json({
      products,
      totalPages,
      currentPage: pageNum,
      totalProducts
    });
  } catch (err) {
    console.error(`Error fetching products: ${err.message}`);
    res.status(500).json({ message: `Server Error: ${err.message}` });
  }
});

// ============================================================
// IMPORTAR Y USAR RUTAS
// ============================================================

console.log('[SERVER] Iniciando carga de rutas...');

// Cargar authRoutes primero (no depende de Transbank)
let authRoutes = null;
try {
  authRoutes = require("./routes/authRoutes");
  console.log("[OK] authRoutes cargado:", authRoutes ? "✅ Existe" : "❌ No existe");
} catch (error) {
  console.error("[ERROR] authRoutes:", error.message);
}

// Cargar rutas estandar
let analyticsRoutes, orderRoutes, messageRoutes, userRoutes;
try {
  analyticsRoutes = require("./routes/analyticsRoutes");
  console.log("[OK] analyticsRoutes cargado:", analyticsRoutes ? "✅" : "❌");
  
  orderRoutes = require("./routes/orderRoutes");
  console.log("[OK] orderRoutes cargado:", orderRoutes ? "✅" : "❌");
  
  messageRoutes = require('./routes/messageRoutes');
  console.log("[OK] messageRoutes cargado:", messageRoutes ? "✅" : "❌");
  
  userRoutes = require("./routes/userRoutes");
  console.log("[OK] userRoutes cargado:", userRoutes ? "✅" : "❌");
} catch (error) {
  console.error("[ERROR] Rutas estandar:", error.message);
}

// Cargar paymentRoutes (puede fallar si Transbank no está configurado)
let paymentRoutes = null;
try {
  paymentRoutes = require('./routes/paymentRoutes');
  console.log("[OK] paymentRoutes cargado:", paymentRoutes ? "✅" : "❌");
} catch (error) {
  console.warn("[WARN] paymentRoutes no disponible:", error.message);
}

// Registrar todas las rutas que se cargaron exitosamente
console.log('[SERVER] Registrando rutas en Express...');

if (authRoutes) {
  app.use("/api/auth", authRoutes);
  console.log("  ✅ /api/auth registrado");
}
if (analyticsRoutes) {
  app.use("/api/analytics", analyticsRoutes);
  console.log("  ✅ /api/analytics registrado");
}
if (orderRoutes) {
  app.use("/api/orders", orderRoutes);
  console.log("  ✅ /api/orders registrado");
}
if (messageRoutes) {
  app.use("/api/messages", messageRoutes);
  console.log("  ✅ /api/messages registrado");
}
if (userRoutes) {
  app.use("/api/users", userRoutes);
  console.log("  ✅ /api/users registrado");
} else {
  console.log("  ❌ /api/users NO se pudo registrar (userRoutes es null)");
}
if (paymentRoutes) {
  app.use("/api/payments", paymentRoutes);
  console.log("  ✅ /api/payments registrado");
}

// Manejo de errores 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en puerto ${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}`);
});
