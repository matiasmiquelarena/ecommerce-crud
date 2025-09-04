const Product = require("../models/product.model");

class ProductDAO {
  async create(productData) {
    return Product.create(productData);
  }

  async getAll(filter = {}, options = {}) {
    return Product.find(filter)
      .limit(options.limit || 0)
      .skip(options.skip || 0)
      .sort(options.sort || {});
  }

  async getById(id) {
    return Product.findById(id);
  }

  async update(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }
}

module.exports = new ProductDAO();

