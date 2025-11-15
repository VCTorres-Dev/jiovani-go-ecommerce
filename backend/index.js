const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

mongoose.connect("mongodb://localhost:27017/dejo_aromas", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(cors());
app.use(express.json());

const productRoutes = require("./routes/productRoutes");
app.use("/api", productRoutes);

app.listen(5000, () => console.log("Server Started"));
