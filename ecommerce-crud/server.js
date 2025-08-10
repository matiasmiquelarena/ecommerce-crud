const express = require('express');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const cors = require('cors');
const session = require('express-session');

const sessionsRouter = require('./routes/sessions.router');
const usersRouter = require('./routes/users.router');

const app = express();

// ===== Middlewares =====
app.use(cors({
  origin: 'http://localhost:3000', // Cambia al front que uses
  credentials: true
}));
app.use(express.json());

// Configuración de session
app.use(session({
  secret: 'claveSuperSecreta', // poner en .env en producción
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true si usas HTTPS
}));

app.use(passport.initialize());

// ===== Conexión a MongoDB Local =====
mongoose.connect('mongodb://localhost:27017/ecommerce-mati', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error al conectar MongoDB:', err));

// ===== Rutas =====
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

// Manejo de rutas no existentes
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ===== Iniciar servidor =====
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
