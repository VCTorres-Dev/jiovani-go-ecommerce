const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/dejo_aromas";

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);

    // Eventos de conexión
    mongoose.connection.on("connected", () => {
      console.log("Mongoose conectado a MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Error de conexión MongoDB:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose desconectado de MongoDB");
    });

    // Manejo graceful de cierre
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log(
        "Conexión MongoDB cerrada debido a terminación de la aplicación"
      );
      process.exit(0);
    });
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
