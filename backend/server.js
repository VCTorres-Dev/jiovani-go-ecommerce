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

// TEST ENDPOINT - Transbank WebPay Plus REAL (HTTP REST API)
app.post("/api/payments/init-test", (req, res) => {
  try {
    console.log('🚀 [TRANSBANK INIT] Iniciando transacción Transbank WebPay Plus...');
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
    
    // Credenciales Transbank (DEMO para testing)
    const commerceCode = process.env.TRANSBANK_COMMERCE_CODE || '597055555532';
    const apiKey = process.env.TRANSBANK_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
    const isProduction = process.env.TRANSBANK_ENV === 'PRODUCTION';
    const host = isProduction ? 'webpay3g.transbank.cl' : 'webpay3gint.transbank.cl';
    
    console.log('🔐 [TRANSBANK] Host:', host);
    console.log('🔐 [TRANSBANK] Commerce Code:', commerceCode);
    
    // Body para Transbank API
    const body = JSON.stringify({
      buy_order: String(buyOrder),
      session_id: String(sessionId || Date.now()),
      amount: parseInt(amount),
      return_url: returnUrl
    });
    
    console.log('📤 [TRANSBANK] Body que enviaremos:', body);
    
    // Opciones del request HTTPS
    const options = {
      hostname: host,
      port: 443,
      path: '/rswebpay/api/webpay/v1.2/transactions',
      method: 'POST',
      headers: {
        'Tbk-Api-Key-Id': commerceCode,
        'Tbk-Api-Key-Secret': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': 'JiovaniGo-Ecommerce/1.0'
      }
    };
    
    console.log('📤 [TRANSBANK] Headers:', JSON.stringify({
      'Tbk-Api-Key-Id': commerceCode,
      'Tbk-Api-Key-Secret': '***HIDDEN***',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }, null, 2));
    
    // Request a Transbank
    const request = https.request(options, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        console.log('📊 [TRANSBANK] Status Code:', response.statusCode);
        console.log('📊 [TRANSBANK] Response (primeros 1000 chars):', data.substring(0, 1000));
        
        try {
          const result = JSON.parse(data);
          
          if (response.statusCode === 201 || response.statusCode === 200) {
            console.log('✅ [TRANSBANK] Transacción creada exitosamente');
            
            // Construir URL de redirección
const redirectUrl = `https://${host}/webpay/v1.2/${result.token}`;
            
            res.json({
              success: true,
              message: 'Transacción iniciada correctamente con Transbank',
              data: {
                url: redirectUrl,
                token: result.token,
                transactionId: buyOrder,
                userEmail: userEmail,
                amount: amount,
                environment: isProduction ? 'production' : 'integration'
              }
            });
          } else {
            console.error('❌ [TRANSBANK] Status error:', response.statusCode);
            console.error('❌ [TRANSBANK] Response:', JSON.stringify(result, null, 2));
            res.status(response.statusCode).json({ 
              success: false, 
              message: 'Error iniciando transacción en Transbank',
              statusCode: response.statusCode,
              error: result.detail || result.message || result
            });
          }
        } catch (parseError) {
          console.error('❌ [TRANSBANK] Error parsing JSON:', parseError.message);
          console.error('❌ [TRANSBANK] Response RAW:', data);
          res.status(response.statusCode || 500).json({ 
            success: false, 
            message: 'Transbank rechazó el request (formato inválido)',
            statusCode: response.statusCode,
            rawResponse: data.substring(0, 500)
          });
        }
      });
    });
    
    request.on('error', (error) => {
      console.error('❌ [TRANSBANK INIT] Error en request HTTPS:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error comunicándose con Transbank',
        error: error.message
      });
    });
    
    request.write(body);
    request.end();
    
  } catch (error) {
    console.error('❌ [TRANSBANK INIT] Error general:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en endpoint de pago',
      error: error.message 
    });
  }
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
 // app.use("/api/payments", paymentRoutes);
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
