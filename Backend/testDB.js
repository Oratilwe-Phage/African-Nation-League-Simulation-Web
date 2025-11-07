import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connection successful!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

testConnection();
