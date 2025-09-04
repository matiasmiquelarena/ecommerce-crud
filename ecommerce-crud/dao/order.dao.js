const Order = require("../models/order.model");

class OrderDAO {
  async create(orderData) {
    return Order.create(orderData);
  }

  async getByUser(userId) {
    return Order.find({ user: userId }).populate("items.product");
  }

  async getById(id) {
    return Order.findById(id).populate("items.product");
  }

  async updateStatus(id, status) {
    return Order.findByIdAndUpdate(id, { status }, { new: true });
  }
}

module.exports = new OrderDAO();
