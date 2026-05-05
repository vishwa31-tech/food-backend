const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const error = new Error("Razorpay keys are missing in environment variables");
    error.statusCode = 500;
    throw error;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
}

exports.createRazorpayOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      branchId,
      branchName,
      deliveryAddress,
      voucherCode,
      discountAmount,
      customerName,
      customerEmail,
      customerPhone,
      paymentType
    } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart items are required" });
    }

    const numericTotal = Number(totalAmount);
    if (!Number.isFinite(numericTotal) || numericTotal <= 0) {
      return res.status(400).json({ success: false, message: "totalAmount must be a positive number" });
    }

    const orderDoc = new Order({
      items,
      totalAmount: numericTotal,
      paymentMethod: paymentType === 'upi' ? 'upi' : 'razorpay',
      paymentStatus: "pending",
      branchId: branchId ?? null,
      branchName: branchName ?? "",
      deliveryAddress: deliveryAddress ?? "",
      voucherCode: voucherCode ?? "",
      discountAmount: Number.isFinite(Number(discountAmount)) ? Number(discountAmount) : 0,
      customerName: customerName ?? "",
      customerEmail: customerEmail ?? "",
      customerPhone: customerPhone ?? ""
    });

    await orderDoc.save();

    const razorpay = getRazorpayClient();
    const amountInPaise = Math.round(numericTotal * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: String(orderDoc._id),
      notes: {
        branchId: branchId ?? "",
        branchName: branchName ?? "",
        paymentType: paymentType === 'upi' ? 'upi' : 'razorpay'
      }
    });

    orderDoc.razorpayOrderId = razorpayOrder.id;
    await orderDoc.save();

    res.status(201).json({
      success: true,
      message: "Razorpay order created",
      data: {
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: orderDoc._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      }
    });
  } catch (error) {
    const status = error.statusCode || 500;
    console.error(error);
    res.status(status).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body || {};

    if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification fields" });
    }

    const orderDoc = await Order.findById(orderId);
    if (!orderDoc) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (orderDoc.razorpayOrderId && orderDoc.razorpayOrderId !== razorpay_order_id) {
      orderDoc.paymentStatus = "failed";
      await orderDoc.save();
      return res.status(400).json({ success: false, message: "Razorpay order mismatch" });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");
    const isValid = expectedSignature === razorpay_signature;

    orderDoc.razorpayPaymentId = razorpay_payment_id;
    orderDoc.razorpaySignature = razorpay_signature;
    orderDoc.paymentStatus = isValid ? "paid" : "failed";

    await orderDoc.save();

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified",
      data: orderDoc
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

