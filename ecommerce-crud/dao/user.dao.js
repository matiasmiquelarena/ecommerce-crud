const User = require("../models/user.model");

class UserDAO {
  async create(userData) {
    return User.createWithHashedPassword(userData);
  }

  async getByEmail(email) {
    return User.findOne({ email });
  }

  async getById(id) {
    return User.findById(id).populate("cart");
  }

  async getAll() {
    return User.find();
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new UserDAO();

