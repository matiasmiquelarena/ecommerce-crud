const productDAO = require("../dao/product.dao");

class ProductRepository {
  async create(productData) {
    return productDAO.create(productData);
  }

  async getAll(filter, options) {
    return productDAO.getAll(filter, options);
  }

  async getById(id) {
    return productDAO.getById(id);
  }

  async update(id, data) {
    return productDAO.update(id, data);
  }

  async delete(id) {
    return productDAO.delete(id);
  }
}

module.exports = new ProductRepository();
