const cartDAO = require("../dao/cart.dao");

class CartRepository {
  async create(cartData) {
    return cartDAO.create(cartData);
  }

  async getByUser(userId) {
    return cartDAO.getByUser(userId);
  }

  async getById(id) {
    return cartDAO.getById(id);
  }

  async update(id, data) {
    return cartDAO.update(id, data);
  }

  async clearCart(userId) {
    return cartDAO.clearCart(userId);
  }

  async delete(id) {
    return cartDAO.delete(id);
  }
}

module.exports = new CartRepository();
