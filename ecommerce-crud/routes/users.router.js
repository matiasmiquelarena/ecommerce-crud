const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const { isAuthenticated, isAdmin } = require('../middlewares/authorization');

const router = express.Router();

// ===== Obtener todos los usuarios (sin password) =====
// Solo admin puede listar todos los usuarios
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ===== Obtener usuario por ID =====
// Solo el usuario dueño o admin pueden acceder
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const loggedUser = req.session.user;

    if (loggedUser.role !== 'admin' && loggedUser.id !== requestedUserId) {
      return res.status(403).json({ error: 'No tenés permiso para ver este usuario' });
    }

    const user = await User.findById(requestedUserId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('❌ Error al obtener usuario por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ===== Crear nuevo usuario =====
// No requiere estar autenticado, es registro público
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Email ya registrado' });
    }

    const newUser = await User.createWithHashedPassword({
      first_name,
      last_name,
      email,
      age,
      password,
      role
    });

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: { ...newUser.toObject(), password: undefined }
    });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ===== Login de usuario =====
// Login público, no requiere middleware
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    req.session.user = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role || 'user'
    };

    res.json({ message: 'Login exitoso', user: req.session.user });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ===== Logout =====
// Solo usuarios logueados pueden hacer logout
router.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo cerrar sesión' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Sesión cerrada con éxito' });
  });
});

// ===== Actualizar usuario por ID =====
// Solo el usuario dueño o admin pueden actualizar
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const loggedUser = req.session.user;

    if (loggedUser.role !== 'admin' && loggedUser.id !== requestedUserId) {
      return res.status(403).json({ error: 'No tenés permiso para actualizar este usuario' });
    }

    const { password, ...updateData } = req.body;

    if (password) {
      updateData.password = bcrypt.hashSync(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      requestedUserId,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario actualizado correctamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ===== Eliminar usuario por ID =====
// Solo admin puede eliminar usuarios
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
