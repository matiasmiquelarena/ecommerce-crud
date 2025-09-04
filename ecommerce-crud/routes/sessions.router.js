const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");
const userService = new UserService();
const { secret } = require("../middlewares/auth.middleware");
const bcrypt = require("bcrypt");

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
