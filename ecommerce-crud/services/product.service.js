const productRepository = require("../repositories/product.repository");

class ProductService {
  async createProduct(productData) {
    return productRepository.create(productData);
  }

  async getAllProducts(filter = {}, options = {}) {
    return productRepository.getAll(filter, options);
  }

  async getProductById(id) {
    return productRepository.getById(id);
  }

  async updateProduct(id, data) {
    return productRepository.update(id, data);
  }

  async deleteProduct(id) {
    return productRepository.delete(id);
  }
}

module.exports = new ProductService();
