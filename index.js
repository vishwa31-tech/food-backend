const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();

const connectDB = require("./config/db"); // ✅ only here

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
  })
);
app.use(express.json());

app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);

connectDB().then(() => {
  console.log("ENV TEST:", process.env.MONGODB_URI);
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => {
    console.log("Server running 🚀");
  });
});
