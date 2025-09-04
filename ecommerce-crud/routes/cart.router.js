const express = require("express");
const router = express.Router();
const cartService = require("../services/cart.service");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

// Crear un carrito (cuando un usuario inicia compra)
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const cart = await cartService.createCart(req.user.id);
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener carrito del usuario logueado
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const cart = await cartService.getCartByUserId(req.user.id);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Agregar producto al carrito
router.post("/add", isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const updatedCart = await cartService.addProduct(req.user.id, productId, quantity);
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar producto del carrito
router.post("/remove", isAuthenticated, async (req, res) => {
  const { productId } = req.body;
  try {
    const updatedCart = await cartService.removeProduct(req.user.id, productId);
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todos los carritos (solo admin)
router.get("/all", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const carts = await cartService.getAllCarts();
    res.json(carts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

