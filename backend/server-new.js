// ============================================================
// IMPORTAR Y USAR RUTAS
// ============================================================

// Cargar authRoutes primero (no depende de Transbank)
let authRoutes = null;
try {
  authRoutes = require("./routes/authRoutes");
  console.log("[INFO] authRoutes cargado exitosamente");
} catch (error) {
  console.error("[ERROR] No se pudo cargar authRoutes:", error.message);
}

// Cargar rutas estándar
let analyticsRoutes, orderRoutes, messageRoutes, userRoutes;
try {
  analyticsRoutes = require("./routes/analyticsRoutes"); 
  orderRoutes = require("./routes/orderRoutes"); 
  messageRoutes = require('./routes/messageRoutes'); 
  userRoutes = require("./routes/userRoutes");
  console.log("[INFO] Rutas estandar cargadas exitosamente");
} catch (error) {
  console.error("[ERROR] No se pudieron cargar algunas rutas estandar:", error.message);
}

// Cargar paymentRoutes (puede fallar si Transbank no está configurado)
let paymentRoutes = null;
try {
  paymentRoutes = require('./routes/paymentRoutes');
  console.log("[INFO] paymentRoutes cargado exitosamente");
} catch (error) {
  console.warn("[WARN] No se pudo cargar paymentRoutes:", error.message);
  console.warn("[WARN] Los pagos con Transbank no estaran disponibles");
}

// Registrar todas las rutas que se cargaron exitosamente
if (authRoutes) {
  app.use("/api/auth", authRoutes);
}
if (analyticsRoutes) {
  app.use("/api/analytics", analyticsRoutes);
}
if (orderRoutes) {
  app.use("/api/orders", orderRoutes);
}
if (messageRoutes) {
  app.use("/api/messages", messageRoutes);
}
if (userRoutes) {
  app.use("/api/users", userRoutes);
}
if (paymentRoutes) {
  app.use("/api/payments", paymentRoutes);
}

console.log("[INFO] Todas las rutas disponibles han sido registradas en Express");
console.log("[INFO] USANDO MONGODB REAL: Usuarios y productos se cargan desde MongoDB Atlas");

// Manejo de errores 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}`);
});
