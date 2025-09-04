const express = require("express");
const router = express.Router();
const orderService = require("../services/order.service");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

// Crear una orden a partir del carrito
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const order = await orderService.createOrder(req.user.id);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener órdenes del usuario logueado
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUserId(req.user.id);
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todas las órdenes (solo admin)
router.get("/all", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
