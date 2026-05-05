const express = require("express");
const router = express.Router();

const {
  createRazorpayOrder,
  verifyRazorpayPayment
} = require("../controllers/paymentController");

router.post("/payments/razorpay/order", createRazorpayOrder);
router.post("/payments/razorpay/verify", verifyRazorpayPayment);

module.exports = router;

