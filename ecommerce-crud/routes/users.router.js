const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

// Crear usuario (registro)
router.post("/", async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todos los usuarios (solo admin)
router.get("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener usuario por ID
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint /current
router.get("/current", isAuthenticated, async (req, res) => {
  res.json(req.user); // req.user ya viene como UserDTO
});

// Actualizar usuario
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar usuario
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
