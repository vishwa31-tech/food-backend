const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const connectDB = require("./config/db"); // ✅ only here

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", orderRoutes);

connectDB().then(() => {
  console.log("ENV TEST:", process.env.MONGODB_URI);
  app.listen(5000, () => {
    console.log("Server running 🚀");
  });
});