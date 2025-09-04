const userDAO = require("../dao/user.dao");

class UserRepository {
  async create(userData) {
    return userDAO.create(userData);
  }

  async getByEmail(email) {
    return userDAO.getByEmail(email);
  }

  async getById(id) {
    return userDAO.getById(id);
  }

  async getAll() {
    return userDAO.getAll();
  }

  async update(id, data) {
    return userDAO.update(id, data);
  }

  async delete(id) {
    return userDAO.delete(id);
  }
}

module.exports = new UserRepository();
