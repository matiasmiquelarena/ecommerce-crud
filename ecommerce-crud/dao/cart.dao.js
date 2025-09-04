const Cart = require("../models/cart.model");

class CartDAO {
  async create(cartData) {
    return Cart.create(cartData);
  }

  async getByUser(userId) {
    return Cart.findOne({ user: userId, status: "active" }).populate("items.product");
  }

  async getById(id) {
    return Cart.findById(id).populate("items.product");
  }

  async update(id, data) {
    return Cart.findByIdAndUpdate(id, data, { new: true });
  }

  async clearCart(userId) {
    return Cart.findOneAndUpdate(
      { user: userId, status: "active" },
      { items: [] },
      { new: true }
    );
  }

  async delete(id) {
    return Cart.findByIdAndDelete(id);
  }
}

module.exports = new CartDAO();
