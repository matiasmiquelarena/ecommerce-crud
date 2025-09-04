const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  buyer: {
    name:  { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  total:  { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["pending", "completed", "canceled"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);

