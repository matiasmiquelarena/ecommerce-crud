const orderDAO = require("../dao/order.dao");

class OrderRepository {
  async createOrder(orderData) {
    return orderDAO.create(orderData);
  }

  async getUserOrders(userId) {
    return orderDAO.getByUser(userId);
  }

  async getOrderById(orderId) {
    return orderDAO.getById(orderId);
  }

  async updateOrderStatus(orderId, status) {
    return orderDAO.updateStatus(orderId, status);
  }
}

module.exports = new OrderRepository();

