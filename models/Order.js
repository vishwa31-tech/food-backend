// models/orderModel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        id: {
          type: Number
        },
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        },
        message: {
          type: String,
          default: ""
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);