const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_para_entrega_local_inseguro';

// Estrategia local para login con email y password
passport.use('login', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password', session: false },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return done(null, false, { message: 'Usuario no encontrado' });

      const valid = user.isValidPassword(password);
      if (!valid) return done(null, false, { message: 'Contraseña incorrecta' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Estrategia JWT para validar token ("current")
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use('current', new JwtStrategy(opts, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub).select('-password');
    if (!user) return done(null, false, { message: 'Token inválido: usuario no existe' });
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
