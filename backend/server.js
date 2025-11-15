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

// Conectar a MongoDB y esperar la conexión
let mongoConnected = false;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dejoaromas", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB conectado exitosamente");
    mongoConnected = true;
  } catch (err) {
    console.log("⚠️ Advertencia: MongoDB no disponible:", err.message);
    console.log("⚠️ Los endpoints de productos y autenticación no funcionarán sin MongoDB");
    mongoConnected = false;
  }
};

// Iniciar conexión
connectMongoDB();

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
    
    // Filtrar por género (case-insensitive)
    if (gender && gender !== 'undefined' && gender !== '') {
      query.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
    }
    
    // Filtrar por búsqueda
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
// RUTAS DE AUTENTICACIÓN CON MONGODB REAL
// ============================================================
const User = require('./models/User');
const jwt = require('jsonwebtoken');

// LOGIN endpoint
app.post("/api/auth/login", requireMongoDB, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('[AUTH] Intento de login:', email);
    
    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y password son requeridos"
      });
    }
    
    // Buscar usuario en MongoDB
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('[AUTH] Login fallido: usuario no encontrado');
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }
    
    // Validar password usando el método del modelo
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log('[AUTH] Login fallido: password incorrecta');
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }
    
    console.log('[AUTH] Login exitoso:', user.email, '(role:', user.role + ')');
    
    // Generar JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'tu_clave_secreta_jwt_muy_segura',
      { expiresIn: '30d' }
    );
    
    res.json({
      success: true,
      message: "Login exitoso",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
    
  } catch (err) {
    console.error(`[AUTH] Error en login: ${err.message}`);
    res.status(500).json({ 
      success: false,
      message: `Error en el servidor: ${err.message}` 
    });
  }
});

// ============================================================
// ENDPOINT DE REGISTRO - Crear nuevo usuario en MongoDB
// ============================================================
app.post("/api/auth/register", requireMongoDB, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('[AUTH] Intento de registro:', email);
    
    // Validaciones
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email y password son requeridos"
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }
    
    // Verificar si el email ya existe en MongoDB
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('[AUTH] Email ya registrado:', email);
      return res.status(409).json({
        success: false,
        message: "Este email ya está registrado"
      });
    }
    
    // Verificar si el username ya existe
    const usernameTaken = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (usernameTaken) {
      console.log('[AUTH] Username ya registrado:', username);
      return res.status(409).json({
        success: false,
        message: "Este username ya está en uso"
      });
    }
    
    // Crear nuevo usuario (el password se hasheará automáticamente por el pre-save hook)
    const newUser = new User({
      username: username,
      email: email.toLowerCase(),
      password: password,
      role: "user" // Los nuevos usuarios siempre son "user"
    });
    
    // Guardar en MongoDB
    await newUser.save();
    
    console.log('[AUTH] Usuario registrado exitosamente en MongoDB:', email);
    
    res.status(201).json({
      success: true,
      message: "Cuenta creada exitosamente",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
    
  } catch (err) {
    console.error(`[AUTH] Error en registro: ${err.message}`);
    res.status(500).json({ 
      success: false,
      message: `Error en el servidor: ${err.message}` 
    });
  }
});

// ============================================================
// ENDPOINT PARA OBTENER USUARIO ACTUAL - Verificar sesión
// ============================================================
app.get("/api/auth/user", requireMongoDB, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No se proporcionó token de autenticación"
      });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_jwt_muy_segura');
    
    // Obtener usuario de MongoDB
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (err) {
    console.error(`[AUTH] Error verificando token: ${err.message}`);
    res.status(401).json({ 
      success: false,
      message: "Token inválido o expirado" 
    });
  }
});

// ============================================================
// ENDPOINT /api/auth/me - Alias de /api/auth/user
// ============================================================
app.get("/api/auth/me", requireMongoDB, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No se proporcionó token de autenticación"
      });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_jwt_muy_segura');
    
    // Obtener usuario de MongoDB
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (err) {
    console.error(`[AUTH] Error verificando token: ${err.message}`);
    res.status(401).json({ 
      success: false,
      message: "Token inválido o expirado" 
    });
  }
});

// Importar y usar rutas
try {
  const analyticsRoutes = require("./routes/analyticsRoutes"); 
  const orderRoutes = require("./routes/orderRoutes"); 
  const messageRoutes = require('./routes/messageRoutes'); 
  const paymentRoutes = require('./routes/paymentRoutes');
  const userRoutes = require("./routes/userRoutes");

  app.use("/api/analytics", analyticsRoutes); 
  app.use("/api/orders", orderRoutes); 
  app.use("/api/messages", messageRoutes); 
  app.use("/api/payments", paymentRoutes);
  app.use("/api/users", userRoutes);
  console.log("✅ Todas las rutas cargadas exitosamente");
  console.log("✅ USANDO MONGODB REAL: Usuarios y productos se cargan desde MongoDB Atlas");
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
