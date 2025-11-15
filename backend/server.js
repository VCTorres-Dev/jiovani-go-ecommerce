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

// Conectar a MongoDB (opcional - no bloquea si falla)
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dejoaromas", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB conectado exitosamente"))
  .catch((err) => console.log("⚠️  Advertencia: MongoDB no disponible (esto es OK para testing de pagos):", err.message));

// Rutas básicas
app.get("/", (req, res) => {
  res.json({ message: "API de Jiovanni Go funcionando correctamente" });
});


// ============================================================
// MOCK ENDPOINT - Para testing SIN credenciales reales
// ============================================================
app.post("/api/payments/init-mock", (req, res) => {
  try {
    console.log('🎭 [MOCK TRANSBANK] Iniciando transacción MOCK (sin credenciales reales)...');
    console.log('📥 Body recibido:', JSON.stringify(req.body, null, 2));
    
    const { amount, buyOrder, sessionId, returnUrl, userEmail } = req.body;
    
    // Validación
    if (!amount || amount <= 0) {
      console.log('❌ Amount inválido:', amount);
      return res.status(400).json({ 
        success: false, 
        message: 'Amount inválido',
        received: amount
      });
    }
    
    if (!buyOrder) {
      console.log('❌ buyOrder faltante');
      return res.status(400).json({ 
        success: false, 
        message: 'buyOrder es requerido' 
      });
    }
    
    if (!returnUrl) {
      console.log('❌ returnUrl faltante');
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
    
    console.log('✅ [MOCK] Token generado:', mockToken);
    console.log('✅ [MOCK] Redirect URL:', redirectUrl);
    
    // Responder con formato idéntico a Transbank REAL
    res.json({
      success: true,
      message: 'Transacción iniciada correctamente (MOCK - sin credenciales reales)',
      data: {
        url: redirectUrl,
        token: mockToken,
        transactionId: buyOrder,
        userEmail: userEmail,
        amount: amount,
        environment: 'mock-integration',
        info: 'Este es un token MOCK. Para producción, obtén credenciales reales en https://publico.transbank.cl'
      }
    });
    
  } catch (error) {
    console.error('❌ [MOCK] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en endpoint MOCK de pago',
      error: error.message 
    });
  }
});

// ============================================================
// MOCK CONFIRM ENDPOINT - Confirmar pago MOCK
// ============================================================
app.post("/api/payments/confirm-mock", (req, res) => {
  try {
    console.log('🎭 [MOCK CONFIRM] Confirmando transacción MOCK...');
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token es requerido'
      });
    }
    
    console.log('✅ [MOCK CONFIRM] Token validado:', token);
    
    // Simular respuesta real de Transbank
    res.json({
      success: true,
      message: 'Pago confirmado exitosamente (MOCK)',
      data: {
        accountingDate: new Date().toISOString().split('T')[0],
        transactionDate: new Date().toISOString(),
        vci: 'TSY', // TSY = tarjeta sin verificación (MOCK)
        status: 'AUTHORIZED',
        amount: 10000,
        buyOrder: 'order-test-123',
        cardNumber: '****6623',
        authorizationCode: 'MOCKAUTH123456',
        responseCode: '0',
        responseDescription: 'Transacción autorizada',
        token: token,
        installmentsAmount: '0',
        installmentsNumber: '1',
        transactionVerificationNumber: 'MOCK12345',
        isMock: true
      }
    });
    
  } catch (error) {
    console.error('❌ [MOCK CONFIRM] Error:', error);
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
    console.log('🔐 [TRANSBANK CONFIRM] Confirmando transacción...');
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
            console.log('✅ [TRANSBANK CONFIRM] Pago confirmado');
            
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
            console.error('❌ [TRANSBANK CONFIRM] Error:', result);
            res.status(response.statusCode).json({
              success: false,
              message: 'Error confirmando transacción',
              error: result.detail || result.message
            });
          }
        } catch (parseError) {
          console.error('❌ [TRANSBANK CONFIRM] Error parsing response:', parseError);
          res.status(500).json({
            success: false,
            message: 'Error procesando respuesta de Transbank',
            error: parseError.message
          });
        }
      });
    });
    
    request.on('error', (error) => {
      console.error('❌ [TRANSBANK CONFIRM] Error en request:', error);
      res.status(500).json({
        success: false,
        message: 'Error comunicándose con Transbank',
        error: error.message
      });
    });
    
    request.write(body);
    request.end();
    
  } catch (error) {
    console.error('❌ [TRANSBANK CONFIRM] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en confirmación',
      error: error.message
    });
  }
});

// ============================================================
// MOCK DATA - PRODUCTOS (temporal hasta que MongoDB funcione)
// ============================================================
const MOCK_PRODUCTS = [
  {
    _id: "1",
    name: "Perfume Sensual",
    description: "Aroma sofisticado y envolvente para mujeres",
    price: 25000,
    gender: "Dama",
    image: "/images/perfume1.jpg",
    stock: 10,
    rating: 4.5
  },
  {
    _id: "2",
    name: "Colonia Fresh",
    description: "Aroma fresco y masculino para hombres",
    price: 22000,
    gender: "Varón",
    image: "/images/perfume2.jpg",
    stock: 8,
    rating: 4.3
  },
  {
    _id: "3",
    name: "Esencia Oriental",
    description: "Aroma oriental intenso y seductor",
    price: 30000,
    gender: "Dama",
    image: "/images/perfume3.jpg",
    stock: 5,
    rating: 4.8
  },
  {
    _id: "4",
    name: "Fragancia Sport",
    description: "Aroma deportivo y energético",
    price: 18000,
    gender: "Varón",
    image: "/images/perfume4.jpg",
    stock: 15,
    rating: 4.2
  },
  {
    _id: "5",
    name: "Aroma Floral",
    description: "Mezcla delicada de flores naturales",
    price: 28000,
    gender: "Dama",
    image: "/images/perfume5.jpg",
    stock: 7,
    rating: 4.6
  },
  {
    _id: "6",
    name: "Esencia Masculina",
    description: "Aroma profundo y duradero para caballeros",
    price: 26000,
    gender: "Varón",
    image: "/images/perfume6.jpg",
    stock: 12,
    rating: 4.4
  }
];

// Endpoint temporal: Productos con mock data
app.get("/api/products", (req, res) => {
  try {
    const { gender, page = 1, limit = 10, search = '' } = req.query;
    
    let filteredProducts = MOCK_PRODUCTS;
    
    // Filtrar por género si es necesario (case-insensitive)
    if (gender && gender !== 'undefined' && gender !== '') {
      const genderLower = gender.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.gender.toLowerCase() === genderLower
      );
    }
    
    // Filtrar por búsqueda
    if (search) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const totalPages = Math.ceil(filteredProducts.length / limitNum);
    
    const products = filteredProducts.slice(
      (pageNum - 1) * limitNum,
      pageNum * limitNum
    );
    
    res.json({
      products,
      totalPages,
      currentPage: pageNum,
      totalProducts: filteredProducts.length,
      note: "MOCK DATA - MongoDB no disponible aún"
    });
  } catch (err) {
    console.error(`Error fetching products: ${err.message}`);
    res.status(500).json({ message: `Server Error: ${err.message}` });
  }
});

// Endpoint temporal: Login con mock (sin BD)
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Mock login - acepta cualquier email/password
    if (email && password) {
      res.json({
        success: true,
        message: "Login exitoso (MOCK - sin BD)",
        user: {
          id: "mock-user-1",
          email: email,
          name: "Usuario Demo",
          role: "customer"
        },
        token: "mock-jwt-token-" + Date.now()
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Email y password son requeridos"
      });
    }
  } catch (err) {
    console.error(`Error en login: ${err.message}`);
    res.status(500).json({ message: `Server Error: ${err.message}` });
  }
});

// Importar y usar rutas
try {
  // TEMPORAL: Comentar authRoutes porque requiere bcryptjs que aún está en issues de instalación
  // const authRoutes = require("./routes/authRoutes");
  
  // const productRoutes = require("./routes/productRoutes");  // Deshabilitado - usando mock
  const analyticsRoutes = require("./routes/analyticsRoutes"); 
  const orderRoutes = require("./routes/orderRoutes"); 
  const messageRoutes = require('./routes/messageRoutes'); 
  const paymentRoutes = require('./routes/paymentRoutes');
  const userRoutes = require("./routes/userRoutes");

  // app.use("/api/auth", authRoutes);
  // app.use("/api/products", productRoutes);  // Usando mock en lugar de productRoutes
  app.use("/api/analytics", analyticsRoutes); 
  app.use("/api/orders", orderRoutes); 
  app.use("/api/messages", messageRoutes); 
  app.use("/api/payments", paymentRoutes);
  app.use("/api/users", userRoutes);
  console.log("✅ Todas las rutas cargadas exitosamente");
  console.log("⚠️ NOTA: Usando MOCK DATA para productos y auth (MongoDB no disponible)");
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
