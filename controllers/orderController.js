const Order = require("../models/Order.js"); // ✅ MUST BE EXACT

exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const order = new Order({
      items,
      totalAmount
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