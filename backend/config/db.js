import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load env variables

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI; // .env se URL lo
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
