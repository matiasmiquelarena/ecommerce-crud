const express = require("express");
const router = express.Router();
const checkoutService = require("../services/checkout.service");
const { isAuthenticated } = require("../middlewares/auth.middleware");

// Obtener resumen del carrito
router.get("/summary", isAuthenticated, async (req, res) => {
  try {
    const summary = await checkoutService.getCartSummary(req.user.id); // req.user viene del middleware
    res.json(summary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Confirmar compra / checkout
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const buyer = req.body; // { name, email, phone }
    const order = await checkoutService.checkout(req.user.id, buyer);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
