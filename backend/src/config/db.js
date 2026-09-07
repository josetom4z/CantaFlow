const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cantaflow');
    console.log(`[CantaFlow MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[CantaFlow MongoDB Error] ${error.message}`);
    // Non-fatal in offline/demo fallback mode, but logged
  }
};

module.exports = connectDB;
