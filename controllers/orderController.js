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