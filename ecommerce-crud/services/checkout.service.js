const cartService = require("./cart.service");
const orderService = require("./order.service");
const Product = require("../models/product.model");

class CheckoutService {
  // Ver un resumen del carrito antes de confirmar
  async getCartSummary(userId) {
    const cart = await cartService.getCart(userId);
    if (!cart || !cart.items.length) throw new Error("El carrito está vacío");

    const summary = cart.items.map(item => ({
      product: {
        id: item.product._id,
        name: item.product.name,
        price: item.product.price
      },
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity
    }));

    const total = summary.reduce((acc, i) => acc + i.subtotal, 0);

    return { items: summary, total };
  }

  // Confirmar la compra y generar la orden
  async checkout(userId, buyer) {
    const cart = await cartService.getCart(userId);
    if (!cart || !cart.items.length) throw new Error("El carrito está vacío");

    // Verificar stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product) throw new Error(`Producto no encontrado: ${item.product._id}`);
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}`);
      }
    }

    // Descontar stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Crear la orden
    const order = await orderService.createOrder(userId, buyer);

    return order;
  }
}

module.exports = new CheckoutService();
