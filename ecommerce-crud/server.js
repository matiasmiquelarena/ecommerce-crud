const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------- Middleware global ----------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- Routers ----------------
const userRouter = require("./routes/users.router");
const productRouter = require("./routes/products.router");
const cartRouter = require("./routes/cart.router");
const orderRouter = require("./routes/order.router");
const checkoutRouter = require("./routes/checkout.router");
const sessionsRouter = require("./routes/sessions.router"); // Login / JWT

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/sessions", sessionsRouter);

// ---------------- Error handling ----------------
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// ---------------- Conexión a MongoDB ----------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB conectado ✅");
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT} 🚀`);
  });
})
.catch(err => {
  console.error("Error conectando a MongoDB:", err);
});
