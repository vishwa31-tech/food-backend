const express = require("express");
const router = express.Router();

const { createOrder, rateOrder } = require("../controllers/orderController");

router.post("/orders", createOrder);
router.put("/orders/:id/rate", rateOrder);

module.exports = router;