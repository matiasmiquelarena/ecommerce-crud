const express = require("express");
const router = express.Router();
const productService = require("../services/product.service");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Crear producto (solo admin)
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar producto (solo admin)
router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar producto (solo admin)
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
