const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");
const userService = new UserService();

const secret = "secretKey"; // podés ponerlo en .env

// Verifica token y setea req.user
const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret);
    const user = await userService.getUserById(decoded.id);
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    req.user = user; // req.user ya es UserDTO
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};

// Solo admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin")
    return res.status(403).json({ error: "Solo admins" });
  next();
};

module.exports = { isAuthenticated, isAdmin, secret };
