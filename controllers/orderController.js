const Order = require("../models/Order.js"); // ✅ MUST BE EXACT

exports.createOrder = async (req, res) => {
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
      paymentMethod
    } = req.body || {};

    if (paymentMethod && paymentMethod !== "cod") {
      return res.status(400).json({
        success: false,
        message: "Use Razorpay endpoints for online payments"
      });
    }

    const order = new Order({
      items,
      totalAmount,
      paymentMethod: "cod",
      paymentStatus: "cod",
      branchId: branchId ?? null,
      branchName: branchName ?? "",
      deliveryAddress: deliveryAddress ?? "",
      voucherCode: voucherCode ?? "",
      discountAmount: Number.isFinite(Number(discountAmount)) ? Number(discountAmount) : 0,
      customerName: customerName ?? "",
      customerEmail: customerEmail ?? "",
      customerPhone: customerPhone ?? ""
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order saved successfully",
      data: order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.rateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    const order = await Order.findByIdAndUpdate(id, { rating }, { new: true });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      data: order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
