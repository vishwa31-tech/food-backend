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
    },
    branchId: {
      type: Number,
      default: null
    },
    branchName: {
      type: String,
      default: ""
    },
    deliveryAddress: {
      type: String,
      default: ""
    },
    voucherCode: {
      type: String,
      default: ""
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    customerName: {
      type: String,
      default: ""
    },
    customerEmail: {
      type: String,
      default: ""
    },
    customerPhone: {
      type: String,
      default: ""
    },
    paymentMethod: {
      type: String,
      default: "cod"
    },
    paymentStatus: {
      type: String,
      default: "pending"
    },
    razorpayOrderId: {
      type: String,
      default: ""
    },
    razorpayPaymentId: {
      type: String,
      default: ""
    },
    razorpaySignature: {
      type: String,
      default: ""
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
