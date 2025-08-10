const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  age:        { type: Number },
  password:   { type: String, required: true }, // guardamos el hash
  cart:       { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
  role:       { type: String, default: 'user' }
}, { timestamps: true });

// Crear usuario con password encriptada (hashSync)
userSchema.statics.createWithHashedPassword = async function(userObj) {
  const User = this;
  const saltRounds = 10;
  const hashed = bcrypt.hashSync(userObj.password, saltRounds);
  userObj.password = hashed;
  const user = new User(userObj);
  return user.save();
};

// Método para validar password plain con hash
userSchema.methods.isValidPassword = function(plainPassword) {
  return bcrypt.compareSync(plainPassword, this.password);
};

// Quitar password al devolver JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
