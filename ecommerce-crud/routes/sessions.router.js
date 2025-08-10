const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_para_entrega_local_inseguro';
const JWT_EXPIRES = '2h';

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email ya registrado' });

    const newUser = await User.createWithHashedPassword({
      first_name,
      last_name,
      email,
      age,
      password,
    });

    return res.status(201).json({ message: 'Usuario creado', user: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Login usuario - genera token JWT
router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'No autorizado' });

    const payload = { sub: user._id, role: user.role, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return res.json({ message: 'Login OK', token, user: user.toJSON() });
  })(req, res, next);
});

// Ruta para validar token y devolver datos del usuario logueado
router.get(
  '/current',
  passport.authenticate('current', { session: false }),
  (req, res) => {
    return res.json({ user: req.user });
  }
);

module.exports = router;
