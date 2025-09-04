const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  age:        { type: Number, min: 0 },
  password:   { type: String, required: true }, // contraseña hasheada
  cart:       { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  role:       { type: String, enum: ["user", "admin", "premium"], default: "user" }
}, { timestamps: true });

// Crear usuario con contraseña hasheada
userSchema.statics.createWithHashedPassword = async function(userObj) {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(userObj.password, saltRounds);
  userObj.password = hashed;
  const user = new this(userObj);
  return user.save();
};

// Validar contraseña
userSchema.methods.isValidPassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// Quitar password al convertir a JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
