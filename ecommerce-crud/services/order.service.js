const orderRepository = require("../repositories/order.repository");
const cartService = require("./cart.service");

class OrderService {
  async createOrder(userId, buyer) {
    const cart = await cartService.getCart(userId);
    if (!cart || !cart.items.length) throw new Error("El carrito está vacío");

    const items = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = await orderRepository.createOrder({
      user: userId,
      items,
      buyer,
      total
    });

    await cartService.clearCart(userId);

    return order;
  }

  async getUserOrders(userId) {
    return orderRepository.getUserOrders(userId);
  }

  async getOrderById(orderId) {
    return orderRepository.getOrderById(orderId);
  }

  async updateStatus(orderId, status) {
    return orderRepository.updateOrderStatus(orderId, status);
  }
}

module.exports = new OrderService();
