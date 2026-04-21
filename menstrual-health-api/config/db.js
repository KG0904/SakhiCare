/**
 * config/db.js - MongoDB Connection
 * 
 * Uses Mongoose to connect to MongoDB.
 * Connection string is read from the MONGO_URI environment variable.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure code if DB connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
