// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("URI:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast (5s) instead of hanging
      family: 4 // Force IPv4 to prevent Node.js DNS resolution hangs
    });
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Error ❌", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;