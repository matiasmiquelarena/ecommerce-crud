// middlewares/authorization.js

// Middleware para chequear autenticación (Passport ya setea req.user)
function isAuthenticated(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({ error: "No estás autenticado" });
}

// Middleware para chequear roles de usuario
function authorize(roles = []) {
  // roles puede ser string o array
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No estás autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No tenés permisos para esta acción" });
    }

    next();
  };
}

module.exports = {
  isAuthenticated,
  authorize,
};
