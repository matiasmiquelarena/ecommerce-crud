const cartRepository = require("../repositories/cart.repository");

class CartService {
  async createCart(userId) {
    return cartRepository.create({ user: userId, items: [] });
  }

  async getCart(userId) {
    return cartRepository.getByUser(userId);
  }

  async addToCart(userId, productId, quantity = 1) {
    const cart = await cartRepository.getByUser(userId);
    if (!cart) return cartRepository.create({ user: userId, items: [{ product: productId, quantity }] });

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    return cartRepository.update(cart._id, { items: cart.items });
  }

  async clearCart(userId) {
    return cartRepository.clearCart(userId);
  }
}

module.exports = new CartService();

